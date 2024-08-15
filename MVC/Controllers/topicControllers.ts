import { fetchTopics, insertTopic } from "../Models/topicModels";
import express from "express";
export async function getTopics(req: express.Request, res: express.Response) {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
}

export async function postTopic(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { body } = req;
    const topic = await insertTopic(body);
    res.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
}
