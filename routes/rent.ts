import express from "express";
import {
  checkBookAvailability,
  getUserRentedBooks,
  removeRent,
  userRentBook,
} from "../controler/rented";

const routes = express.Router();

// Route for renting a book
routes.post("/rent/:bookId", userRentBook);
routes.delete("/delete/:bookId", removeRent);

// Route to check availability of a book
routes.get("/availability/:bookId", checkBookAvailability);

// Route to get all books rented by the user
routes.get("/rentedBooks/:bookId", getUserRentedBooks);

export default routes;
