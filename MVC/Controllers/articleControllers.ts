import { fetchArticles, fetchArticleById } from "../Models/articleModel";
import express from "express";
export async function getArticles(req: express.Request, res: express.Response) {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
}

export async function getArticleById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { article_id } = req.params;
    const article = await fetchArticleById(Number(article_id));
    res.status(200).send({ article });
  } catch (next) {}
}
