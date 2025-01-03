import { review } from "../../TS types";
import client from "./prismaClient";

export async function fetchReviews() {
  try {
    const reviews = await client.reviews.findMany({
      select: {
        review_id: true,
        created_at: true,
        review_title: true,
        _count: { select: { reviewComments: true } },
        review_image_url: true,
        likes: true,
        dislikes: true,
        author: { select: { username: true } },
        genre: { select: { genre_name: true } },
      },
    });
    const formattedReviews = reviews.map((review) => {
      const {
        review_id,
        created_at,
        review_title,
        review_image_url,
        likes,
        dislikes,
        author: { username },
        genre: { genre_name },
        _count: { reviewComments },
      } = review;
      return {
        review_id,
        created_at,
        review_title,
        review_image_url,
        likes,
        dislikes,
        commentCount: reviewComments,
        author: username,
        genre: genre_name,
      };
    });
    return formattedReviews;
  } finally {
    await client.$disconnect();
  }
}

export async function fetchReviewById(id: number) {
  try {
    const review = await client.reviews.findUnique({
      where: { review_id: id },
      select: {
        review_id: true,
        created_at: true,
        review_title: true,
        body: true,
        review_image_url: true,
        likes: true,
        dislikes: true,
        author: { select: { username: true } },
        genre: { select: { genre_name: true } },
        _count: { select: { reviewComments: true } },
      },
    });
    if (review !== null) {
      const {
        review_id,
        created_at,
        review_title,
        body,
        review_image_url,
        likes,
        dislikes,
        author: { username },
        genre: { genre_name },
        _count: { reviewComments },
      } = review;
      return {
        review_id,
        created_at,
        review_title,
        body,
        review_image_url,
        likes,
        dislikes,
        author: username,
        genre: genre_name,
        commentCount: reviewComments,
      };
    } else {
      await client.$disconnect();
      return Promise.reject({ status: 404, msg: "review does not exist" });
    }
  } finally {
    await client.$disconnect();
  }
}

export async function insertReview(reviewToInsert: review) {
  try {
    const reviews = await client.reviews.createManyAndReturn({
      data: reviewToInsert,
    });
    return reviews[0];
  } finally {
    client.$disconnect();
  }
}
