import { Request, Response } from "express";
import prisma from "..";

export const getAllCatagorys = async (req: Request, res: Response) => {
  try {
    // Fetch all categories
    const categories = await prisma.category.findMany();
    res.json(categories); // This line should be correct
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
