import prisma from "..";
import { Request, Response } from "express";

export const userRentBook = async (
  req: Request<{ bookId: string }, {}, { userId: string }>,
  res: Response
) => {
  const { userId } = req.body;
  const { bookId } = req.params;

  try {
    // Check if the book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { owner: true }, // Include the owner details
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book is already rented
    if (book.isRented) {
      return res.status(400).json({ message: "Book is already rented" });
    }

    // Create a record in the userBook table
    const rented = await prisma.userBook.create({
      data: {
        userId: userId,
        bookId: bookId,
      },
    });

    // Update the book status to rented
    await prisma.book.update({
      where: { id: bookId },
      data: { isRented: true },
    });

    // Create a transaction record
    const transaction = await prisma.transaction.create({
      data: {
        amount: book.price, // Assuming the price of the book is the transaction amount
        ownerId: book.ownerId,
        description: `Book rented: ${book.title} by user ${userId}`,
      },
    });

    // Update the owner's balance
    await prisma.owner.update({
      where: { id: book.ownerId },
      data: { balance: { increment: book.price } }, // Increment the owner's balance
    });

    res.status(201).json({ rented, transaction });
  } catch (error) {
    console.error("Error renting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const removeRent = async (
  req: Request<{ bookId: string }, {}, {}, { userId: string }>,
  res: Response
) => {
  const userId = req.query.userId as string; // Access userId from query parameters
  const { bookId } = req.params;

  try {
    // Check if the book is rented by the user
    const rentedBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
      include: {
        book: true,
      },
    });

    if (!rentedBook) {
      console.log(
        `No rental found for bookId: ${bookId} and userId: ${userId}`
      );
      return res
        .status(404)
        .json({ message: "Rented book not found or already returned" });
    }

    // Delete the transaction related to this rental
    const transaction = await prisma.transaction.findFirst({
      where: {
        description: `Book rented: ${rentedBook.book.title} by user ${userId}`,
        ownerId: rentedBook.book.ownerId,
      },
    });

    if (transaction) {
      await prisma.transaction.delete({
        where: {
          id: transaction.id,
        },
      });
    }

    // Delete the rental record from userBook
    await prisma.userBook.delete({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
    });

    res.status(200).json({ message: "Book rental removed successfully" });
  } catch (error) {
    console.error("Error removing rented book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRentedBooks = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params;

  try {
    // Find all entries in the userBook table for the specified userId
    const rentedBooks = await prisma.userBook.findMany({
      where: { userId },
      include: {
        book: true, // Include book details
      },
    });

    // Check if user has rented books
    if (rentedBooks.length === 0) {
      return res
        .status(404)
        .json({ message: "No rented books found for this user" });
    }

    // Extract book details
    const books = rentedBooks.map((rentedBook) => rentedBook.book);

    res.status(200).json(books);
  } catch (error) {
    console.error("Error retrieving rented books:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const checkBookAvailability = async (
  req: Request<{ bookId: string }>,
  res: Response
) => {
  const { bookId } = req.params;

  try {
    // Fetch the book details along with the rented copies
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        users: true, // Include the related UserBooks to count rented copies
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Calculate the number of rented copies
    const rentedCount = book.users.length;

    // Calculate availability
    const availableCopies = book.amount - rentedCount;

    // If no copies are available, update the isAvailable field
    if (availableCopies <= 0) {
      await prisma.book.update({
        where: { id: bookId },
        data: { isAvailable: false },
      });
    }

    res.status(200).json({
      bookId: book.id,
      title: book.title,
      availableCopies,
    });
  } catch (error) {
    console.error("Error checking book availability:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", error });
  }
};
