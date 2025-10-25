import express from "express";
import morgan from "morgan";
import { ENV } from "./config/env.js";

const app = express();

app.use(morgan("tiny"));

app.use((req, res) => {
  res.send("Server is running!");
});

app.listen(ENV.PORT, () => {
  console.log(`Server is listening on port ${ENV.PORT}`);
});
