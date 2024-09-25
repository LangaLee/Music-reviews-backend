import { fetchLikes, insertLikes } from "../Models/likeModels";
import express from "express";
export async function getLikes(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const {
      params: { user_id },
    } = req;
    const likes = await fetchLikes(Number(user_id));
    res.status(200).send({ likes });
  } catch (error) {
    next(error);
  }
}

export async function postLikes(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { body } = req;
    const like = await insertLikes(body);
    res.status(201).send({ like });
  } catch (error) {
    next(error);
  }
}
