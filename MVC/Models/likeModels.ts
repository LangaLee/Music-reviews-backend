import { Prisma } from "@prisma/client";
import { like, likesDataType } from "../../TS types";
import client from "./prismaClient";

export async function fetchLikes(user_id: number) {
  try {
    const user = await client.users.findUnique({ where: { user_id: user_id } });

    if (!user) {
      return Promise.reject({ msg: "User does not exist", status: 404 });
    }

    const likes = await client.userLikes.findMany({
      where: { user_id: user_id },
    });

    const likesToReturn: likesDataType = likes.map((like) => {
      const { user_id, review_id, value } = like;
      return { user_id, review_id, value };
    });
    return likesToReturn;
  } finally {
    client.$disconnect();
  }
}

export async function insertLikes(likeData: like) {
  try {
    if (likeData.value !== 1 && likeData.value !== -1)
      return Promise.reject({
        status: 400,
        msg: "likes value can only be 1 or -1",
      });

    const userLikes = await client.userLikes.findMany({
      where: {
        user_id: likeData.user_id,
      },
    });
    const likeExists = userLikes.filter(
      (likeObject) => likeObject.review_id === likeData.review_id
    );
    if (likeExists[0]) {
      // return Promise.reject({
      //   status: 400,
      //   msg: "Like object already exists",
      // });

      const updatedLike = await client.userLikes.update({
        where: {
          like_id: likeExists[0].like_id,
          review_id: likeData.review_id,
        },
        data: {
          value: likeData.value,
        },
      });
      return updatedLike;
    }

    const like = await client.userLikes.createManyAndReturn({
      data: likeData,
    });

    return like[0];
  } finally {
    await client.$disconnect();
  }
}
