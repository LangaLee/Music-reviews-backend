import { fetchComments, insertComment } from "../Models/commentModels";
import express from "express";

export async function getComments(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const {
      params: { review_id },
    } = req;
    const comments = await fetchComments(Number(review_id));
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
}

export async function postComment(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { body } = req;
    const comment = await insertComment(body);
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
}
