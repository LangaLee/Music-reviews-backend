import { userToInsert } from "../../TS types";
import client from "./prismaClient";

export async function findUsers() {
  try {
    const users = await client.users.findMany();
    return users;
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
