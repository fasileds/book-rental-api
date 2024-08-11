import express from "express";
import { getAllCatagorys } from "../controler/catagory";

const routes = express.Router();

routes.get("/catagories", getAllCatagorys);

export default routes;
