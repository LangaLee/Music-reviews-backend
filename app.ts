import express from "express";
import { getUsers, postUser } from "./MVC/Controllers/userControllers";
import getDoc from "./MVC/Controllers/docControllers";
import { getGenres, postGenre } from "./MVC/Controllers/genreControllers";
import {
  getReviews,
  getReviewsById,
  postReview,
} from "./MVC/Controllers/reviewControllers";
import { errorThrown } from "./TS types";
import { getComments, postComment } from "./MVC/Controllers/commentControllers";
import { getLikes, postLikes } from "./MVC/Controllers/likeControllers";
const app = express();
app.use(express.json());

app.get("/api/users", getUsers);

app.post("/api/users", postUser);

app.get("/api/docs", getDoc);

app.get("/api/genres", getGenres);

app.post("/api/genres", postGenre);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.post("/api/reviews", postReview);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/comments", postComment);

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
delete /api/reviews/:review_id
patch /api/likes/:user_id/:like_id
*/
