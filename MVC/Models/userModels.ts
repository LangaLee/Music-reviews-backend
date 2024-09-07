import { returnedUsers, userToInsert } from "../../TS types";
import client from "./prismaClient";

export async function findUsers() {
  try {
    const users = await client.users.findMany();
    const usersToReturn: Array<returnedUsers> = users.map((user) => {
      const { created_at, profile_pic_url, username } = user;
      return { created_at, username, profile_pic_url };
    });
    return usersToReturn;
  } finally {
    await client.$disconnect();
  }
}

export async function insertUser(user: userToInsert) {
  try {
    const returnedUser = await client.users.createManyAndReturn({
      data: [user],
    });
    return returnedUser[0];
  } finally {
    await client.$disconnect();
  }
}
