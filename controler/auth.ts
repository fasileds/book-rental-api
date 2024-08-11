import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "..";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  if (typeof password !== "string") {
    return res.status(400).json({ error: "Invalid password type" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: userName,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user); // 201 status code for resource creation
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma error code for unique constraint violation
      res.status(409).json({ error: "Email already exists" }); // Conflict status code for existing email
    } else {
      res.status(500).json({ error: "An unexpected error occurred" }); // General server error
    }
  }
};
export const registerOwner = async (req: Request, res: Response) => {
  const { userName, email, password, balance, phoneNo, address } = req.body;

  // Validate input
  if (!userName || !email || !password || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new owner in the database
    const user = await prisma.owner.create({
      data: {
        name: userName,
        email: email,
        password: hashedPassword,
        balance: balance,
        phoneNo: phoneNo,
        addrasse: address, // corrected field name
      },
    });

    // Respond with the created user
    res.status(201).json(user);
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating owner:", error);

    // Send a generic error message
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      const passwordChecked = await bcrypt.compare(password, user.password);

      if (passwordChecked) {
        const accessToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_SECRET || "defaultsecret",
          {
            expiresIn: "3d",
          }
        );

        res.status(200).json({ accessToken, user });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
export const logInOwner = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.owner.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      const passwordChecked = await bcrypt.compare(password, user.password);

      if (passwordChecked) {
        const accessToken = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
            isChecked: user.isChecked,
          },
          process.env.JWT_SECRET || "defaultsecret",
          {
            expiresIn: "3d",
          }
        );

        res.status(200).json({ accessToken, user });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
