import express from "express";
import { getUsers } from "./MVC/Controllers/userControllers";
import getDoc from "./MVC/Controllers/docControllers";
import { getTopics } from "./MVC/Controllers/topicControllers";
import { getArticles } from "./MVC/Controllers/articleControllers";
const app = express();

app.get("/api/users", getUsers);

app.get("/api/docs", getDoc);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("*", (req, res) => {
  res.status(500).send({ msg: "Endpoint not found" });
});
export default app;
