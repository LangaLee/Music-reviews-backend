import { genreToInsert } from "../../TS types";
import client from "./prismaClient";
export async function fetchGenres() {
  try {
    const genres = await client.genres.findMany();
    return genres;
  } finally {
    await client.$disconnect();
  }
}

export async function insertGenre(genreToInsert: genreToInsert) {
  try {
    const returnedGenre = await client.genres.createManyAndReturn({
      data: genreToInsert,
    });
    return returnedGenre[0];
  } finally {
    await client.$disconnect();
  }
}
