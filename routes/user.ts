import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controler/user";
import { verifyToken } from "../midleware/varifayToken";

const routes = express.Router();

routes.get("/", verifyToken, getAllUser);
routes.get("/:id", getSingleUser);
routes.put("/updateUser/:id", verifyToken, updateUser);
routes.delete("/deletUser/:id", verifyToken, deleteUser);

export default routes;
