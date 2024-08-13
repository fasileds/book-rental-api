import express from "express";
import {
  chaking,
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
routes.put("/updateBooks/:id", verifyToken, updateBooks);
routes.delete("/deleteBook/:bookId", verifyToken, deleteBooks);
routes.get("/serchBooks", searchBooks);
routes.get("/getOwnersBook", verifyToken, getOwnersBooks);
routes.get("/getValidBook", getValidBooks);
routes.put("/chaked/:id", chaking);

export default routes;
