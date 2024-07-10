import { PrismaClient } from "@prisma/client";
import seedingData from "../data";
import { articleData, topicData, userData } from "../../TS types";

const client = new PrismaClient();

async function deleteTables() {
  const tableNames: Array<{ tablename: String }> =
    await client.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");
  try {
    await client.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.error({ error });
  }
}

async function insertUsers(users: userData) {
  const data = await client.users.createManyAndReturn({ data: users });
  return data;
}
async function insertTopics(topics: topicData) {
  const data = await client.topics.createManyAndReturn({ data: topics });
  return data;
}
async function insertArticles(
  articles: articleData,
  users: userData,
  topics: topicData
) {
  const formatedData = articles.map((article) => {
    const articleCopy = { ...article };
    users.forEach((user) => {
      if (user.username === articleCopy.author) {
        articleCopy.author_id = user.user_id;
        delete articleCopy.author;
      }
    });
    topics.forEach((topic) => {
      if (topic.topic_name === articleCopy.topic) {
        articleCopy.topic_id = topic.topic_id;
        delete articleCopy.topic;
      }
    });
    return articleCopy;
  });
  await client.articles.createMany({ data: formatedData });
}

async function seed({ userData, commentData, articleData, topicData }) {
  await deleteTables();
  const returnedUsers = await insertUsers(userData);
  const returnedTopics = await insertTopics(topicData);
  await insertArticles(articleData, returnedUsers, returnedTopics);
}

seed(seedingData);
