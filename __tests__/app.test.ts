import { beforeEach, describe, expect, test } from "@jest/globals";
import app from "../app";
import supertest from "supertest";
import {
  returnedUsers,
  returnedGenres,
  returnedReviews,
  returnedComments,
  like,
} from "../TS types";
import fs from "fs/promises";
import seedData from "../prisma/seed/seed";
import userData from "../prisma/testData/userData";
import commentData from "../prisma/testData/commentData";
import reviewData from "../prisma/testData/reviewData";
import genreData from "../prisma/testData/genreData";
import likesData from "../prisma/testData/likesData";
beforeEach(async () => {
  await seedData(userData, genreData, reviewData, commentData, likesData);
});
describe("Testing the server", () => {
  describe("GET /api/docs", () => {
    test("200: returns an object describing the endpoints", async () => {
      const response = await supertest(app).get("/api/docs");
      const documentation = await fs.readFile(
        `${__dirname}/../documentation/endpoints.json`,
        "utf-8"
      );
      const {
        status,
        body: { docs },
      } = response;
      expect(status).toBe(200);
      expect(docs).toEqual(JSON.parse(documentation));
    });
  });
  describe("GET /api/users", () => {
    test("200: returns users on a key of users", async () => {
      const response = await supertest(app).get("/api/users");
      const {
        body: { users },
        status,
      } = response;
      expect(status).toBe(200);
      expect(users.length).toBe(4);
      users.forEach((user: returnedUsers) => {
        expect(typeof user.user_id).toBe("number");
        expect(new Date(user.created_at)).toEqual(expect.any(Date));
        expect(typeof user.profile_pic_url).toBe("string");
        expect(typeof user.username).toBe("string");
      });
    });
  });
  describe("POST /api/users", () => {
    test("201: returns the posted user", async () => {
      const userToPost = {
        username: "skips",
        password: "mona",
        profile_pic_url:
          "https://regularshowwiki.weebly.com/uploads/7/4/1/1/7411048/2193739_orig.png",
      };
      const response = await supertest(app).post("/api/users").send(userToPost);
      const {
        status,
        body: { user },
      } = response;
      expect(status).toBe(201);
      expect(user.username).toBe("skips");
      expect(user.user_id).toBe(5);
      expect(user.profile_pic_url).toBe(userToPost.profile_pic_url);
      expect(new Date(user.created_at)).toEqual(expect.any(Date));
    });
    test("400: when posting without all the required fields", async () => {
      const userToPost = {
        password: "skips",
        profile_pic_url:
          "https://regularshowwiki.weebly.com/uploads/7/4/1/1/7411048/2193739_orig.png",
      };
      const response = await supertest(app).post("/api/users").send(userToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
  describe("GET /api/notFound", () => {
    test("404: returns and object with a key of msg", async () => {
      const response = await supertest(app).get("/api/lee");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(404);
      expect(msg).toBe("Endpoint not found");
    });
  });
  describe("GET /api/genres", () => {
    test("200: returns available genres", async () => {
      const response = await supertest(app).get("/api/genres");
      const {
        status,
        body: { genres },
      } = response;
      expect(status).toBe(200);
      expect(genres.length).toBe(4);
      genres.forEach((genre: returnedGenres) => {
        expect(typeof genre.genre_id).toBe("number");
        expect(typeof genre.genre_name).toBe("string");
        expect(typeof genre.description).toBe("string");
      });
    });
  });
  describe("POST /api/genres", () => {
    test("201: returns the posted genre", async () => {
      const genreToPost = {
        genre_name: "Anime Ops & Eds",
        description: "taking a look at a section that makes the anime effect",
      };
      const response = await supertest(app)
        .post("/api/genres")
        .send(genreToPost);
      const {
        status,
        body: { genre },
      } = response;
      expect(status).toBe(201);
      expect(genre).toEqual({
        genre_id: 5,
        genre_name: "Anime Ops & Eds",
        description: "taking a look at a section that makes the anime effect",
      });
    });
    test("400: when posting without the required fields", async () => {
      const genreToInsert = { genre_name: "lol" };
      const response = await supertest(app)
        .post("/api/genres")
        .send(genreToInsert);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
  describe("GET /api/reviews", () => {
    test("200: returns all available reviews", async () => {
      const response = await supertest(app).get("/api/reviews");
      const {
        status,
        body: { reviews },
      } = response;
      expect(status).toBe(200);
      expect(reviews.length).toBe(3);
      reviews.forEach((review: returnedReviews) => {
        expect(typeof review.review_id).toBe("number");
        expect(typeof review.review_image_url).toBe("string");
        expect(typeof review.author).toBe("string");
        expect(new Date(review.created_at)).toEqual(expect.any(Date));
        expect(typeof review.dislikes).toBe("number");
        expect(typeof review.likes).toBe("number");
        expect(typeof review.review_title).toBe("string");
        expect(typeof review.genre).toBe("string");
        expect(typeof review.commentCount).toBe("number");
      });
    });
  });
  describe("POST /api/reviews", () => {
    test("201: returns the posted review", async () => {
      const reviewToPost = {
        review_title: "listening to new music",
        body: "listening to new music can be challenging epecially when the genre is new to you and is no an easy listen. But most times it usually pays off. As the years have went by we have become reliant on people recommending things for us and critics telling us whats good and whats not. We have lost that sense of adventure.",
        review_image_url:
          "https://lh3.googleusercontent.com/xdvVADAcKur3p70uPFbMjIojgvgMomG762aHBMQSM9ry4rmWx8ft5bDt2z7ZCPLv62BviVHCt797IPCeRw=w544-h544-l90-rj",
        author_id: 3,
        genre_id: 4,
        likes: 0,
        dislikes: 0,
      };
      const response = await supertest(app)
        .post("/api/reviews")
        .send(reviewToPost);
      const {
        status,
        body: { review },
      } = response;
      expect(status).toBe(201);
      expect(review.review_id).toBe(4);
      expect(review.review_title).toBe(reviewToPost.review_title);
      expect(review.body).toBe(reviewToPost.body);
      expect(review.review_image_url).toBe(reviewToPost.review_image_url);
      expect(review.author_id).toBe(3);
      expect(review.genre_id).toBe(4);
      expect(review.likes).toBe(0);
      expect(review.dislikes).toBe(0);
    });
    test("400: when a required field is missing", async () => {
      const reviewToPost = {
        title: "listening to new music",
        body: "listening to new music can be challenging epecially when the genre is new to you and is no an easy listen. But most times it usually pays off. As the years have went by we have become reliant on people recommending things for us and critics telling us whats good and whats not. We have lost that sense of adventure.",
        review_image_url:
          "https://lh3.googleusercontent.com/xdvVADAcKur3p70uPFbMjIojgvgMomG762aHBMQSM9ry4rmWx8ft5bDt2z7ZCPLv62BviVHCt797IPCeRw=w544-h544-l90-rj",
        author_id: 3,
        genre_id: 4,
      };
      const response = await supertest(app)
        .post("/api/reviews")
        .send(reviewToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("400: when the review being posted has an invalid author", async () => {
      const reviewToPost = {
        title: "listening to new music",
        body: "listening to new music can be challenging epecially when the genre is new to you and is no an easy listen. But most times it usually pays off. As the years have went by we have become reliant on people recommending things for us and critics telling us whats good and whats not. We have lost that sense of adventure.",
        review_image_url:
          "https://lh3.googleusercontent.com/xdvVADAcKur3p70uPFbMjIojgvgMomG762aHBMQSM9ry4rmWx8ft5bDt2z7ZCPLv62BviVHCt797IPCeRw=w544-h544-l90-rj",
        author_id: "three",
        genre_id: 4,
        likes: 0,
        dislikes: 0,
      };
      const response = await supertest(app)
        .post("/api/reviews")
        .send(reviewToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    test("200: returns the review with that id", async () => {
      const response = await supertest(app).get("/api/reviews/1");
      const {
        status,
        body: {
          review: {
            review_id,
            review_image_url,
            body,
            review_title,
            author,
            likes,
            dislikes,
            commentCount,
            genre,
          },
        },
      } = response;
      expect(status).toBe(200);
      expect(review_id).toBe(1);
      expect(typeof review_image_url).toBe("string");
      expect(typeof body).toBe("string");
      expect(typeof review_title).toBe("string");
      expect(typeof author).toBe("string");
      expect(typeof genre).toBe("string");
      expect(typeof likes).toBe("number");
      expect(typeof dislikes).toBe("number");
      expect(typeof commentCount).toBe("number");
    });
    test("400: when passed an invalid id", async () => {
      const response = await supertest(app).get("/api/reviews/one");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("404: when passed a valid id that doesn't exist in the db", async () => {
      const response = await supertest(app).get("/api/reviews/10");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(404);
      expect(msg).toBe("review does not exist");
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    test("200: returns all the comments under that review", async () => {
      const response = await supertest(app).get("/api/reviews/3/comments");
      const {
        status,
        body: { comments },
      } = response;
      expect(status).toBe(200);
      expect(comments.length).toBe(3);
      comments.forEach((comment: returnedComments) => {
        expect(comment.review_id).toBe(3);
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(new Date(comment.created_at)).toEqual(expect.any(Date));
      });
    });
    test("200: returns an empty array for an review without comments", async () => {
      const response = await supertest(app).get("/api/reviews/1/comments");
      const {
        status,
        body: { comments },
      } = response;
      expect(status).toBe(200);
      expect(comments).toHaveLength(0);
    });
    test("400: returns bad request when passed an invalid review_id", async () => {
      const response = await supertest(app).get(
        "/api/reviews/invalid/comments"
      );
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("invalid review id");
    });
    test("404: returns when passed a valid id but the review doesn't exists", async () => {
      const response = await supertest(app).get("/api/reviews/10/comments");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(404);
      expect(msg).toBe("review does not exist");
    });
  });
  describe("POST /api/reviews/comments", () => {
    test("201: returns the posted comment", async () => {
      const commentToPost = {
        author_id: 4,
        body: "its been a while since I listened to that EP, I should go back to it",
        review_id: 3,
      };
      const response = await supertest(app)
        .post("/api/reviews/comments")
        .send(commentToPost);
      const {
        status,
        body: { comment },
      } = response;
      expect(status).toBe(201);
      expect(comment.review_id).toBe(3);
      expect(comment.body).toBe(commentToPost.body);
      expect(comment.comment_id).toBe(4);
      expect(new Date(comment.created_at)).toEqual(expect.any(Date));
      expect(comment.author_id).toBe(4);
    });
    test("400: when attempting to post with missing fields", async () => {
      const commentToPost = { author_id: 2, body: "no review_id" };
      const response = await supertest(app)
        .post("/api/reviews/comments")
        .send(commentToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("400: posting a comment with an author_id that doesn't exist in the db", async () => {
      const commentToPost = {
        author_id: 9,
        body: "no review_id",
        review_id: 3,
      };
      const response = await supertest(app)
        .post("/api/reviews/comments")
        .send(commentToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("400: posting a comment with an review_id that doesn't exist in the db", async () => {
      const commentToPost = {
        author_id: 2,
        body: "non existent review_id",
        review_id: 50,
      };
      const response = await supertest(app)
        .post("/api/reviews/comments")
        .send(commentToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
  describe("GET /api/likes/:user_id", () => {
    test("200: returns the users likes data", async () => {
      const response = await supertest(app).get("/api/likes/1");
      const {
        status,
        body: { likes },
      } = response;
      expect(status).toBe(200);
      expect(likes.length).toBe(2);
      likes.forEach((like: like) => {
        expect(like.user_id).toBe(1);
        expect(typeof like.review_id).toBe("number");
        expect(typeof like.value).toBe("number");
      });
    });
    test("200: returns an empty array if the the user doesn't have any likes", async () => {
      const response = await supertest(app).get("/api/likes/2");
      const {
        status,
        body: { likes },
      } = response;
      expect(status).toBe(200);
      expect(likes).toEqual([]);
    });
    test("400: when passed an invalid user_id", async () => {
      const response = await supertest(app).get("/api/likes/one");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("404: when passed a user_id that doesn't exist in the db", async () => {
      const response = await supertest(app).get("/api/likes/8");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(404);
      expect(msg).toBe("User does not exist");
    });
  });
  describe("POST /api/likes", () => {
    test("201: posts the likes object to the database", async () => {
      const likeObjectToPost = { user_id: 1, review_id: 3, value: 1 };
      const response = await supertest(app)
        .post("/api/likes")
        .send(likeObjectToPost);

      const {
        status,
        body: { like },
      } = response;
      expect(status).toBe(201);
      expect(like).toEqual({ like_id: 3, user_id: 1, review_id: 3, value: 1 });
    });
    test("400: when trying to post a like to an review that already has a like by that user", async () => {
      const likeObjectToPost = { user_id: 1, review_id: 1, value: 1 };
      const response = await supertest(app)
        .post("/api/likes")
        .send(likeObjectToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("400: when the like object posted has a value that is not 1 or -1", async () => {
      const likeObjectToPost = { user_id: 1, review_id: 3, value: 2 };
      const response = await supertest(app)
        .post("/api/likes")
        .send(likeObjectToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("likes value can only be 1 or -1");
    });
    test("400: when a user that doesn't exist tries to post a like", async () => {
      const likeToPost = { user_id: 5, review_id: 3, value: 1 };
      const response = await supertest(app).post("/api/likes").send(likeToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
});
