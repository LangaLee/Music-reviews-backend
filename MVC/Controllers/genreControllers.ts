import { fetchGenres, insertGenre } from "../Models/genreModels";
import express from "express";
export async function getGenres(req: express.Request, res: express.Response) {
  const genres = await fetchGenres();
  res.status(200).send({ genres });
}

export async function postGenre(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { body } = req;
    const genre = await insertGenre(body);
    res.status(201).send({ genre });
  } catch (error) {
    next(error);
  }
}
