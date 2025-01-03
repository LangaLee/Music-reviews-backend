import {
  fetchReviews,
  fetchReviewById,
  insertReview,
} from "../Models/reviewModel";
import express from "express";
export async function getReviews(req: express.Request, res: express.Response) {
  const reviews = await fetchReviews();
  res.status(200).send({ reviews });
}

export async function getReviewsById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { review_id } = req.params;
    const review = await fetchReviewById(Number(review_id));
    res.status(200).send({ review });
  } catch (error) {
    next(error);
  }
}

export async function postReview(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { body } = req;
    const review = await insertReview(body);
    res.status(201).send({ review });
  } catch (error) {
    next(error);
  }
}
