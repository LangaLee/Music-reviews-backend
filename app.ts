import express from "express";
import { getUsers } from "./MVC/Controllers/userControllers";
import getDoc from "./MVC/Controllers/docControllers";
import { getTopics } from "./MVC/Controllers/topicControllers";
import {
  getArticles,
  getArticleById,
} from "./MVC/Controllers/articleControllers";
import { errorThrown } from "./TS types";
const app = express();

app.get("/api/users", getUsers);

app.get("/api/docs", getDoc);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("*", (req, res) => {
  res.status(500).send({ msg: "Endpoint not found" });
});

app.use(
  (
    error: errorThrown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error.name) {
      res.status(400).send({ msg: "Bad request" });
    }
    if (error.msg) {
      res.status(404).send({ msg: error.msg });
    }
  }
);
export default app;
