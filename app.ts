import express from "express";
import { getUsers, postUser } from "./MVC/Controllers/userControllers";
import getDoc from "./MVC/Controllers/docControllers";
import { getTopics } from "./MVC/Controllers/topicControllers";
import {
  getArticles,
  getArticleById,
} from "./MVC/Controllers/articleControllers";
import { errorThrown } from "./TS types";
import { getComments } from "./MVC/Controllers/commentControllers";
const app = express();
app.use(express.json());
app.get("/api/users", getUsers);

app.post("/api/users", postUser);

app.get("/api/docs", getDoc);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

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
      res.status(error.status).send({ msg: error.msg });
    }
  }
);
export default app;
