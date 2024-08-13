import express from "express";
import {
  chaking,
  deleteOwners,
  getAllOwners,
  getOwnerStatus,
  getSingleOwner,
  updateOwners,
} from "../controler/owner";
import { verifyToken } from "../midleware/varifayToken";

const routes = express.Router();

routes.get("/", verifyToken, getAllOwners);
routes.get("/find/:id", getSingleOwner);
routes.put("/updateOwners/:id", verifyToken, updateOwners);
routes.delete("/deleteOwners/:id", verifyToken, deleteOwners);
routes.get("/ownersStatuse/:ownerId", verifyToken, getOwnerStatus);
routes.put("/approveUser/:id", chaking);

export default routes;
