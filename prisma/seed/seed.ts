import { PrismaClient } from "@prisma/client";

import {
  reviewDataType,
  commentDataType,
  genreDataType,
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
    if (tableNames.length === 0) return;
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
async function insertGenres(genres: genreDataType) {
  await client.genres.createMany({ data: genres });
}
async function insertReviews(reviews: reviewDataType) {
  await client.reviews.createMany({
    data: reviews,
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
  genres: genreDataType,
  reviews: reviewDataType,
  comments: commentDataType,
  likes: likesDataType
) {
  await deleteTables();
  await insertUsers(users);
  await insertGenres(genres);
  await insertReviews(reviews);
  await insertComments(comments);
  await insertLikes(likes);
}

export default seedData;
