import express from "express";
import getUsers from "./MVC/Controllers/userControllers";
const app = express();

app.get("/api/users", getUsers);

app.get("*", (req, res) => {
  res.status(500).send({ msg: "Endpoint not found" });
});
export default app;
