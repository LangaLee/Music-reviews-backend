import { PrismaClient } from "@prisma/client";

import {
  articleDataType,
  commentDataType,
  topicDataType,
  userDataType,
  likesDataType,
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

async function insertLikes(likes: likesDataType) {
  await client.userLikes.createMany({ data: likes });
}

async function seedData(
  users: userDataType,
  topics: topicDataType,
  articles: articleDataType,
  comments: commentDataType,
  likes: likesDataType
) {
  await deleteTables();
  await insertUsers(users);
  await insertTopics(topics);
  await insertArticles(articles);
  await insertComments(comments);
  await insertLikes(likes);
}

export default seedData;
