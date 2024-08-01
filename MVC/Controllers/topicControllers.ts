import { fetchTopics } from "../Models/topicModels";
import express from "express";
export async function getTopics(req: express.Request, res: express.Response) {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
}
