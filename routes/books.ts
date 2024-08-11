import express from "express";
import {
  createBooks,
  deleteBooks,
  getAllBooks,
  getOwnersBooks,
  getSingleBook,
  getValidBooks,
  searchBooks,
  updateBooks,
} from "../controler/book";
import { verifyToken } from "../midleware/varifayToken";

const routes = express.Router();

routes.get("/", verifyToken, getAllBooks);
routes.post("/createBook", verifyToken, createBooks);
routes.get("/find/:id", getSingleBook);
routes.put("/updateUser/:id", verifyToken, updateBooks);
routes.delete("/deletUser/:id", verifyToken, deleteBooks);
routes.get("/serchBooks", searchBooks);
routes.get("/getOwnersBook", verifyToken, getOwnersBooks);
routes.get("/getValidBook", getValidBooks);

export default routes;
