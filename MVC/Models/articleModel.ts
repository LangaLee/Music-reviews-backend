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
    return articles;
  } finally {
    await client.$disconnect();
  }
}
