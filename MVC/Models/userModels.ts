import client from "./prismaClient";

export async function findUsers() {
  try {
    const users = await client.users.findMany();
    return users;
  } finally {
    await client.$disconnect();
  }
}
