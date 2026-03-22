import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectMongoDB } from "./config/db.js";

import questionsRoutes from "./routes/questions.js";
// import usersRoutes from "./routes/users.js";
// import reviewsRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();

connectMongoDB();

app.use(cors());
app.use(express.json());

app.use("/images", express.static("src/public/images"));

app.use("/api/questions", questionsRoutes);
// app.use("/api/users", usersRoutes);
// app.use("/api/reviews", reviewsRoutes);

app.use("/images", express.static(path.join(process.cwd(), "src/public/images/testsImg")));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
