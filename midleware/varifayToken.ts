import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "./types"; // Import the JwtPayload type

const JWT_SECRET = process.env.JWT_SECRET || "fasiledes";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, "defaultsecret", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user as JwtPayload;
      next();
    });
  } else {
    return res.status(401).json({ message: "Authorization header missing" });
  }
};
