import { commentDataType, returnedComments } from "../../TS types";
import { fetchReviewById } from "./reviewModel";
import client from "./prismaClient";
export async function fetchComments(review_id: number) {
  try {
    if (!review_id) {
      await client.$disconnect();
      return Promise.reject({ status: 400, msg: "invalid review id" });
    }
    await fetchReviewById(review_id);
    const comments = await client.comments.findMany({
      where: { review_id: review_id },
      include: { author: { select: { username: true } } },
    });
    const commentsToSend: Array<returnedComments> = comments.map((comment) => {
      const {
        review_id,
        body,
        created_at,
        author: { username },
        comment_id,
      } = comment;
      return { review_id, body, created_at, author: username, comment_id };
    });
    return commentsToSend;
  } finally {
    await client.$disconnect();
  }
}

export async function insertComment(commentToInsert: commentDataType) {
  try {
    const comment = await client.comments.createManyAndReturn({
      data: commentToInsert,
    });
    return comment[0];
  } finally {
    await client.$disconnect();
  }
}
