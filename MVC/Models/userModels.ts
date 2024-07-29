import { PrismaClient } from "@prisma/client";
import { usersReturnData } from "../../TS types";
const prisma = new PrismaClient();

async function findUsers(): Promise<usersReturnData> {
  try {
    const users = await prisma.users.findMany();
    return users;
  } finally {
    await prisma.$disconnect();
  }
}

export default findUsers;
