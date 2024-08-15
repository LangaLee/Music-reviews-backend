import { topicToInsert } from "../../TS types";
import client from "./prismaClient";
export async function fetchTopics() {
  try {
    const topics = await client.topics.findMany();
    return topics;
  } finally {
    await client.$disconnect();
  }
}

export async function insertTopic(topicToInsert: topicToInsert) {
  try {
    const returnedTopic = await client.topics.createManyAndReturn({
      data: topicToInsert,
    });
    return returnedTopic[0];
  } finally {
    await client.$disconnect();
  }
}
