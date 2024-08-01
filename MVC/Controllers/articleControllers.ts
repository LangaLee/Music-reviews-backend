import { fetchArticles } from "../Models/articleModel";
import express from "express";
export async function getArticles(req: express.Request, res: express.Response) {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
}
