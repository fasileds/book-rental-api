import prisma from "..";
import { Request, Response } from "express";
import { Owner } from "@prisma/client";
import { defineAbility } from "../midleware/ability";
interface CreateBookBody {
  title: string;
  author: string;
  ownerId: string;
  isAproved?: boolean;
  isRented?: boolean;
  amount?: number;
  price?: number;
  category: string; // Receive category name instead of category ID
}

export const createBooks = async (
  req: Request<{}, {}, CreateBookBody>,
  res: Response
) => {
  const {
    title,
    author,
    ownerId,
    isAproved,
    isRented,
    amount,
    price,
    category,
  } = req.body;
  const user = req.user as Owner; // Ensure `req.user` is correctly set by your authentication middleware
  const ability = defineAbility(user);
  console.log(category);
  if (!ability.can("create", "Book")) {
    return res
      .status(403)
      .json({ message: "You are not allowed to create a book" });
  }

  try {
    // Check if the category exists by name (case-insensitive)
    const categorys = await prisma.category.findFirst({
      where: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    });

    if (!categorys) {
      console.log("Category not found");
      return res.status(404).json({ message: "Category not found" });
    }

    // Create the book and associate it with the owner and category
    const book = await prisma.book.create({
      data: {
        title,
        author,
        owner: {
          connect: { id: user.id }, // Connect the book to the owner using ownerId
        },
        category: {
          connect: { id: categorys.id }, // Connect the book to the category using the found category ID
        },
        isAproved: isAproved ?? false,
        isRented: isRented ?? false,
        amount: amount ?? 1,
        price: price ?? 0,
      },
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  const user = req.user as Owner;
  const ability = defineAbility(user);

  if (!ability.can("read", "Book")) {
    return res
      .status(403)
      .json({ message: "You are not allowed to read books" });
  }

  try {
    // Fetch all books and include owner details
    const books = await prisma.book.findMany({
      include: {
        owner: true, // Include related owner information
      },
    });

    // Map over the books to include owner details in the response
    const booksWithOwner = books.map((book) => ({
      ...book,
      ownerName: book.owner.name, // Assuming 'name' is the field for the owner's name
    }));

    res.json(booksWithOwner);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getSingleBook = async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.findUnique({
      where: {
        id: req.params.toString(),
      },
    });
    res.json(book);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteBooks = async (req: Request, res: Response) => {
  const user = req.user as Owner;
  const ability = defineAbility(user);

  if (!ability.can("delete", "Book")) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete a book" });
  }

  try {
    const { bookId } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!user.isAdmin && book.ownerId !== user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this book" });
    }

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateBooks = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  const user = req.user as Owner;
  const ability = defineAbility(user);

  if (!ability.can("update", "Book")) {
    return res
      .status(403)
      .json({ message: "You are not allowed to update a book" });
  }

  try {
    const bookId = req.params.id;
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!user.isAdmin && book.ownerId !== user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this book" });
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: req.body,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const getOwnersBooks = async (req: Request, res: Response) => {
  const user = req.user as Owner;
  const ability = defineAbility(user);

  // Log user ID and ability
  console.log("User ID:", user.id);
  console.log("Ability:", ability.rules);

  // Check permissions
  if (!ability.can("read", "Book")) {
    return res
      .status(403)
      .json({ message: "You are not allowed to read this data" });
  }

  try {
    // Fetch books for the owner
    const books = await prisma.book.findMany({
      where: {
        ownerId: user.id,
      },
    });

    // Log books to check the result
    console.log("Books Retrieved:", books);

    // Return the books
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const searchBooks = async (req: Request, res: Response) => {
  const { title, category, author } = req.query;

  try {
    // Prepare where conditions
    const whereConditions: any = {};

    if (title) {
      whereConditions.title = {
        contains: title as string,
        mode: "insensitive",
      };
    }

    if (category) {
      whereConditions.category = {
        contains: category as string,
        mode: "insensitive",
      };
    }

    if (author) {
      whereConditions.author = {
        contains: author as string,
        mode: "insensitive",
      };
    }

    console.log("Where conditions:", whereConditions); // Debug info

    // Fetch books based on the where conditions
    const books = await prisma.book.findMany({
      where: whereConditions,
    });

    console.log("Books found:", books); // Debug info
    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching for books:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const getValidBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        isAproved: true,
      },
    });
    res.json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const chaking = async (req: Request, res: Response) => {
  const { id } = req.params; // Extracting the id from req.params
  const { isAproved } = req.body; // Extracting the isAproved value from req.body

  try {
    await prisma.book.update({
      where: { id: id }, // Using the id from params
      data: { isAproved: isAproved }, // Assigning the passed value to isAproved
    });
    res
      .status(200)
      .json({ message: "Book approval status updated successfully" });
    console.log("Book approval status updated successfully");
    console.log(isAproved);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while updating the book approval status",
    });
  }
};
