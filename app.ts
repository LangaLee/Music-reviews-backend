import express from "express";
import { getUsers, postUser } from "./MVC/Controllers/userControllers";
import getDoc from "./MVC/Controllers/docControllers";
import { getTopics, postTopic } from "./MVC/Controllers/topicControllers";
import {
  getArticles,
  getArticleById,
  postArticle,
} from "./MVC/Controllers/articleControllers";
import { errorThrown } from "./TS types";
import { getComments, postComment } from "./MVC/Controllers/commentControllers";
import { getLikes, postLikes } from "./MVC/Controllers/likeControllers";
const app = express();
app.use(express.json());

app.get("/api/users", getUsers);

app.post("/api/users", postUser);

app.get("/api/docs", getDoc);

app.get("/api/topics", getTopics);

app.post("/api/topics", postTopic);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.post("/api/articles", postArticle);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/comments", postComment);

app.get("/api/likes/:user_id", getLikes);

app.post("/api/likes", postLikes);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
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

/* 
Enpoints to add 
delete /api/comments/:comment_id
delete /api/articles/:article_id
patch /api/likes/:user_id/:like_id
*/
