import express from "express";
import getUsers from "./MVC/Controllers/userControllers";
import getDoc from "./MVC/Controllers/docsControllers";
const app = express();

app.get("/api/users", getUsers);

app.get("/api/docs", getDoc);

app.get("*", (req, res) => {
  res.status(500).send({ msg: "Endpoint not found" });
});
export default app;
