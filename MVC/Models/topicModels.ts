import client from "./prismaClient";
export async function fetchTopics() {
  try {
    const topics = await client.topics.findMany();
    return topics;
  } finally {
    await client.$disconnect();
  }
}
