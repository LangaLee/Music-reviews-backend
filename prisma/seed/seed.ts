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
  const formatedData = articles.map(
    (article: {
      title: string;
      body: string;
      author?: string;
      topic?: string;
      topic_id: number;
      article_image_url: string;
      likes: number;
      dislikes: number;
      author_id: number;
    }) => {
      const articleCopy = { ...article };
      users.forEach(
        (user: {
          username: string;
          password: string;
          profile_pic_url: string;
          user_id: number;
        }) => {
          if (user.username === articleCopy.author) {
            articleCopy.author_id = user.user_id;
            delete articleCopy.author;
          }
        }
      );
      topics.forEach(
        (topic: {
          topic_name: string;
          description: string;
          topic_id: number;
        }) => {
          if (topic.topic_name === articleCopy.topic) {
            articleCopy.topic_id = topic.topic_id;
            delete articleCopy.topic;
          }
        }
      );
      return articleCopy;
    }
  );
  await client.articles.createManyAndReturn({
    data: formatedData,
  });
}
async function insertComments(comments: commentData, users: userData) {
  const formatedComments = comments.map((comment) => {
    const commentCopy = { ...comment };
    users.forEach((user) => {
      if (user.username === commentCopy.author) {
        commentCopy.author_id = user.user_id;
        delete commentCopy.author;
      }
    });
    return commentCopy;
  });
  await client.comments.createMany({ data: formatedComments });
}

async function seed(
  users: userDataType,
  topics: topicDataType,
  articles: articleDataType,
  comments: commentDataType
) {
  await deleteTables();
  const returnedUsers = await insertUsers(users);
  const returnedTopics = await insertTopics(topics);
  await insertArticles(articles, returnedUsers, returnedTopics);
  await insertComments(comments, returnedUsers);
}

seed(userData, topicData, articleData, commentData);
