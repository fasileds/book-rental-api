import express from "express";
import {
  deleteOwners,
  getAllOwners,
  getOwnerStatus,
  getSingleOwner,
  updateOwners,
} from "../controler/owner";
import { verifyToken } from "../midleware/varifayToken";

const routes = express.Router();

routes.get("/", verifyToken, getAllOwners);
routes.get("/:id", getSingleOwner);
routes.put("/updateOwners/:id", verifyToken, updateOwners);
routes.delete("/deleteOwners/:id", verifyToken, deleteOwners);
routes.delete("/ownersStatuse/:ownerId", verifyToken, getOwnerStatus);

export default routes;
