import { returnedArticles } from "../../TS types";
import client from "./prismaClient";

export async function fetchArticles() {
  try {
    const articles = await client.articles.findMany({
      select: {
        article_id: true,
        created_at: true,
        title: true,
        _count: { select: { articleComments: true } },
        article_image_url: true,
        likes: true,
        dislikes: true,
        author: { select: { username: true } },
        topic: { select: { topic_name: true } },
      },
    });
    const formattedArticles = articles.map((article) => {
      const {
        article_id,
        created_at,
        title,
        article_image_url,
        likes,
        dislikes,
        author: { username },
        topic: { topic_name },
        _count: { articleComments },
      } = article;
      return {
        article_id,
        created_at,
        title,
        article_image_url,
        likes,
        dislikes,
        commentCount: articleComments,
        author: username,
        topic: topic_name,
      };
    });
    return formattedArticles;
  } finally {
    await client.$disconnect();
  }
}

export async function fetchArticleById(id: number) {
  try {
    const article = await client.articles.findUnique({
      where: { article_id: id },
      select: {
        article_id: true,
        created_at: true,
        title: true,
        body: true,
        article_image_url: true,
        likes: true,
        dislikes: true,
        author: { select: { username: true } },
        topic: { select: { topic_name: true } },
        _count: { select: { articleComments: true } },
      },
    });
    if (article !== null) {
      const {
        article_id,
        created_at,
        title,
        body,
        article_image_url,
        likes,
        dislikes,
        author: { username },
        topic: { topic_name },
        _count: { articleComments },
      } = article;
      return {
        article_id,
        created_at,
        title,
        body,
        article_image_url,
        likes,
        dislikes,
        author: username,
        topic: topic_name,
        commentCount: articleComments,
      };
    } else {
      await client.$disconnect();
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
  } finally {
    await client.$disconnect();
  }
}
