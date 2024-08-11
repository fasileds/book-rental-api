import { User } from "@prisma/client";
import prisma from "..";
import { Request, Response } from "express";
import { defineAbility } from "../midleware/ability";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.toString(),
      },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params;
  const { email, password, name } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: id.toString() },
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: {
        id: id.toString(),
      },
    });
    res.json("deleted succfully");
  } catch (error) {
    res.status(500).json(error);
  }
};
