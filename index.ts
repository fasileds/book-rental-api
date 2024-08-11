import { PrismaClient } from "@prisma/client";
import express from "express";
import userRoutes from "./routes/user";
import ownersRoute from "./routes/owner";
import booksRoutes from "./routes/books";
import authRoutes from "./routes/auth";
import rentRoutes from "./routes/rent";
import catagoriesRoutes from "./routes/catagories";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.listen(3001, () => {
  console.log("app is running in port 3001");
});
// const hand = async () => {
//   const categories = await prisma.category.createMany({
//     data: [
//       { name: "Romance" },
//       { name: "novel" },
//       { name: "biography" },
//       { name: "history" },
//     ],
//   });
// };
// hand();
app.use("/api/user", userRoutes);
app.use("/api/owners", ownersRoute);
app.use("/api/auth", authRoutes);
app.use("/api/book", booksRoutes);
app.use("/api/rent", rentRoutes);
app.use("/api/catagories", catagoriesRoutes);

export default prisma;
