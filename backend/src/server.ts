import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 8080;

app.use(morgan("tiny"));

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
