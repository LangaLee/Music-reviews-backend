import { PrismaClient } from "@prisma/client";

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

async function insertUsers() {}

async function seed() {
  await deleteTables();
  await insertUsers();
}
