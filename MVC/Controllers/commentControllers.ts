import { fetchComments } from "../Models/commentModels";
import express from "express";

export async function getComments(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const {
      params: { article_id },
    } = req;
    const comments = await fetchComments(Number(article_id));
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
}
