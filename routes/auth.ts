import express from "express";
import {
  logInUser,
  logInOwner,
  registerUser,
  registerOwner,
} from "../controler/auth";

const routes = express.Router();

routes.post("/register/user", registerUser);
routes.post("/register/owner", registerOwner);
routes.post("/login/user", logInUser);
routes.post("/login/owner", logInOwner);

export default routes;
