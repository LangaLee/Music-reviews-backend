import { PrismaClient } from "@prisma/client";
import userData from "../data/userData";
import commentData from "../data/commentData";
import articleData from "../data/articleData";
import topicData from "../data/topicData";
import {
  articleDataType,
  commentDataType,
  topicDataType,
  userDataType,
} from "../../TS types";

const client = new PrismaClient();

async function deleteTables() {
  const tableNames: Array<{ tablename: String }> =
    await client.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .map((name) => `"public"."${name}"`)
    .join(", ");
  try {
    await client.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables} RESTART IDENTITY;`
    );
    // CASCADE ??
  } catch (error) {
    console.error({ error });
  }
}

async function insertUsers(users: userDataType) {
  await client.users.createMany({ data: users });
}
async function insertTopics(topics: topicDataType) {
  await client.topics.createMany({ data: topics });
}
async function insertArticles(articles: articleDataType) {
  await client.articles.createMany({
    data: articles,
  });
}
async function insertComments(comments: commentDataType) {
  await client.comments.createMany({ data: comments });
}

async function seedData(
  users: userDataType,
  topics: topicDataType,
  articles: articleDataType,
  comments: commentDataType
) {
  await deleteTables();
  await insertUsers(users);
  await insertTopics(topics);
  await insertArticles(articles);
  await insertComments(comments);
}
seedData(userData, topicData, articleData, commentData);
