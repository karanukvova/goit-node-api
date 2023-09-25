import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contactsRouter from "./routes/api/contactsRouter.js";
import usersRouter from "./routes/api/usersRouter.js";


const app = express();
dotenv.config()


app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
