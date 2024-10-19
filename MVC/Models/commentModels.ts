import { commentDataType, returnedComments } from "../../TS types";
import { fetchArticleById } from "./articleModel";
import client from "./prismaClient";
export async function fetchComments(article_id: number) {
  try {
    if (!article_id) {
      await client.$disconnect();
      return Promise.reject({ status: 400, msg: "invalid article id" });
    }
    await fetchArticleById(article_id);
    const comments = await client.comments.findMany({
      where: { article_id: article_id },
      include: { author: { select: { username: true } } },
    });
    const commentsToSend: Array<returnedComments> = comments.map((comment) => {
      const {
        article_id,
        body,
        created_at,
        author: { username },
        comment_id,
      } = comment;
      return { article_id, body, created_at, author: username, comment_id };
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
