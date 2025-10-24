import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 8080;

app.use(morgan("tiny"));

app.use((req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
