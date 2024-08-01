import client from "./prismaClient";

export async function fetchArticles() {
  try {
    const articles = await client.articles.findMany({
      include: {
        author: { select: { username: true } },
        topic: { select: { topic_name: true } },
      },
    });

    return articles;
  } finally {
    await client.$disconnect();
  }
}
