import prisma from "..";
import { Request, Response } from "express";
import { Owner } from "@prisma/client";
import { defineAbility } from "../midleware/ability";

export const getAllOwners = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const user = req.user as Owner;
  const abbility = defineAbility(user);
  if (!abbility.can("read", "User")) {
    return res
      .status(403)
      .json({ message: "You are not allowed to get all users" });
  }
  try {
    const Owners = await prisma.owner.findMany();
    res.json(Owners);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSingleOwner = async (req: Request, res: Response) => {
  try {
    const Owner = await prisma.owner.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json(Owner);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteOwners = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const user = req.user as Owner;
  const abbility = defineAbility(user);
  if (!abbility.can("delete", "User", user.id)) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete  users" });
  }
  try {
    const ownerId = req.params.id;

    // Check if the owner exists before attempting to delete
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Delete the owner
    await prisma.owner.delete({
      where: { id: ownerId },
    });

    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (error) {
    console.error("Error deleting owner:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateOwners = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = req.params.id;
  const { email, password, name } = req.body;
  const user = req.user as Owner;
  const ability = defineAbility(user);

  // Ensure the user has permission to update the owner record
  if (!ability.can("update", "User", user.id)) {
    return res
      .status(403)
      .json({ message: "You are not allowed to update this owner" });
  }

  try {
    // Check if the owner exists before attempting to update
    const owner = await prisma.owner.findUnique({
      where: { id },
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Update the owner details
    const updatedOwner = await prisma.owner.update({
      where: { id },
      data: {
        email,
        password,
        name,
      },
    });

    res.status(200).json(updatedOwner);
  } catch (error) {
    console.error("Error updating owner:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getOwnerStatus = async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  const user = req.user as Owner;
  const ability = defineAbility(user);

  if (!ability.can("read", "User", ownerId)) {
    return res
      .status(403)
      .json({ message: "You are not allowed to view this owner's status" });
  }

  try {
    // Get total books owned by the owner
    const totalBooks = await prisma.book.count({
      where: { ownerId },
    });

    // Get the number of books in each category
    const booksPerCategory = await prisma.book.groupBy({
      by: ["categoryId"],
      where: { ownerId },
      _count: { id: true },
    });

    // Get all transactions for the current year
    const currentYear = new Date().getFullYear();
    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId,
        createdAt: {
          gte: new Date(currentYear, 0, 1), // Start of the year
          lt: new Date(currentYear + 1, 0, 1), // Start of the next year
        },
      },
    });

    // Aggregate transactions by month
    const monthlyBalance = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i, 1).toLocaleString("default", {
        month: "short",
      }),
      amount: 0,
    }));

    transactions.forEach((transaction) => {
      const month = transaction.createdAt.getMonth();
      monthlyBalance[month].amount += transaction.amount;
    });

    // Get total balance
    const totalBalance = await prisma.transaction.aggregate({
      where: { ownerId },
      _sum: { amount: true },
    });

    const ownerStatus = {
      totalBooks,
      booksPerCategory,
      monthlyBalance,
      totalBalance: totalBalance._sum.amount || 0,
    };

    res.status(200).json(ownerStatus);
  } catch (error) {
    console.error("Error getting owner status:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
