import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import app from "../app";
import supertest from "supertest";
import {
  returnedUsers,
  returnedTopics,
  returnedArticles,
  returnedComments,
  like,
} from "../TS types";
import fs from "fs/promises";
import seedData from "../prisma/seed/seed";
import userData from "../prisma/testData/userData";
import commentData from "../prisma/testData/commentData";
import articleData from "../prisma/testData/articleData";
import topicData from "../prisma/testData/topicData";
import likesData from "../prisma/testData/likesData";
beforeEach(async () => {
  await seedData(userData, topicData, articleData, commentData, likesData);
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
      expect(docs).toEqual(documentation);
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
  describe("GET /api/topics", () => {
    test("200: returns available topics", async () => {
      const response = await supertest(app).get("/api/topics");
      const {
        status,
        body: { topics },
      } = response;
      expect(status).toBe(200);
      expect(topics.length).toBe(4);
      topics.forEach((topic: returnedTopics) => {
        expect(typeof topic.topic_id).toBe("number");
        expect(typeof topic.topic_name).toBe("string");
        expect(typeof topic.description).toBe("string");
      });
    });
  });
  describe("POST /api/topics", () => {
    test("201: returns the posted topic", async () => {
      const topicToPost = {
        topic_name: "Anime Ops & Eds",
        description: "taking a look at a section that makes the anime effect",
      };
      const response = await supertest(app)
        .post("/api/topics")
        .send(topicToPost);
      const {
        status,
        body: { topic },
      } = response;
      expect(status).toBe(201);
      expect(topic).toEqual({
        topic_id: 5,
        topic_name: "Anime Ops & Eds",
        description: "taking a look at a section that makes the anime effect",
      });
    });
    test("400: when posting without the required fields", async () => {
      const topicToInsert = { topic_name: "lol" };
      const response = await supertest(app)
        .post("/api/topics")
        .send(topicToInsert);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
  describe("GET /api/articles", () => {
    test("200: returns all available articles", async () => {
      const response = await supertest(app).get("/api/articles");
      const {
        status,
        body: { articles },
      } = response;
      expect(status).toBe(200);
      expect(articles.length).toBe(3);
      articles.forEach((article: returnedArticles) => {
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.article_image_url).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(new Date(article.created_at)).toEqual(expect.any(Date));
        expect(typeof article.dislikes).toBe("number");
        expect(typeof article.likes).toBe("number");
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.commentCount).toBe("number");
      });
    });
  });
  describe("POST /api/articles", () => {
    test("201: returns the posted article", async () => {
      const articleToPost = {
        title: "listening to new music",
        body: "listening to new music can be challenging epecially when the genre is new to you and is no an easy listen. But most times it usually pays off. As the years have went by we have become reliant on people recommending things for us and critics telling us whats good and whats not. We have lost that sense of adventure.",
        article_image_url:
          "https://lh3.googleusercontent.com/xdvVADAcKur3p70uPFbMjIojgvgMomG762aHBMQSM9ry4rmWx8ft5bDt2z7ZCPLv62BviVHCt797IPCeRw=w544-h544-l90-rj",
        author_id: 3,
        topic_id: 4,
        likes: 0,
        dislikes: 0,
      };
      const response = await supertest(app)
        .post("/api/articles")
        .send(articleToPost);
      const {
        status,
        body: { article },
      } = response;
      expect(status).toBe(201);
      expect(article.article_id).toBe(4);
      expect(article.title).toBe(articleToPost.title);
      expect(article.body).toBe(articleToPost.body);
      expect(article.article_image_url).toBe(articleToPost.article_image_url);
      expect(article.author_id).toBe(3);
      expect(article.topic_id).toBe(4);
      expect(article.likes).toBe(0);
      expect(article.dislikes).toBe(0);
    });
    test("400: when a required field is missing", async () => {
      const articleToPost = {
        title: "listening to new music",
        body: "listening to new music can be challenging epecially when the genre is new to you and is no an easy listen. But most times it usually pays off. As the years have went by we have become reliant on people recommending things for us and critics telling us whats good and whats not. We have lost that sense of adventure.",
        article_image_url:
          "https://lh3.googleusercontent.com/xdvVADAcKur3p70uPFbMjIojgvgMomG762aHBMQSM9ry4rmWx8ft5bDt2z7ZCPLv62BviVHCt797IPCeRw=w544-h544-l90-rj",
        author_id: 3,
        topic_id: 4,
      };
      const response = await supertest(app)
        .post("/api/articles")
        .send(articleToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("400: when the article being posted has an invalid author", async () => {
      const articleToPost = {
        title: "listening to new music",
        body: "listening to new music can be challenging epecially when the genre is new to you and is no an easy listen. But most times it usually pays off. As the years have went by we have become reliant on people recommending things for us and critics telling us whats good and whats not. We have lost that sense of adventure.",
        article_image_url:
          "https://lh3.googleusercontent.com/xdvVADAcKur3p70uPFbMjIojgvgMomG762aHBMQSM9ry4rmWx8ft5bDt2z7ZCPLv62BviVHCt797IPCeRw=w544-h544-l90-rj",
        author_id: "three",
        topic_id: 4,
        likes: 0,
        dislikes: 0,
      };
      const response = await supertest(app)
        .post("/api/articles")
        .send(articleToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: returns the article with that id", async () => {
      const response = await supertest(app).get("/api/articles/1");
      const {
        status,
        body: {
          article: {
            article_id,
            article_image_url,
            body,
            title,
            author,
            likes,
            dislikes,
            commentCount,
            topic,
          },
        },
      } = response;
      expect(status).toBe(200);
      expect(article_id).toBe(1);
      expect(typeof article_image_url).toBe("string");
      expect(typeof body).toBe("string");
      expect(typeof title).toBe("string");
      expect(typeof author).toBe("string");
      expect(typeof topic).toBe("string");
      expect(typeof likes).toBe("number");
      expect(typeof dislikes).toBe("number");
      expect(typeof commentCount).toBe("number");
    });
    test("400: when passed an invalid id", async () => {
      const response = await supertest(app).get("/api/articles/one");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("404: when passed a valid id that doesn't exist in the db", async () => {
      const response = await supertest(app).get("/api/articles/10");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(404);
      expect(msg).toBe("article does not exist");
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: returns all the comments under that article", async () => {
      const response = await supertest(app).get("/api/articles/3/comments");
      const {
        status,
        body: { comments },
      } = response;
      expect(status).toBe(200);
      expect(comments.length).toBe(3);
      comments.forEach((comment: returnedComments) => {
        expect(comment.article_id).toBe(3);
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(new Date(comment.created_at)).toEqual(expect.any(Date));
      });
    });
    test("200: returns an empty array for an article without comments", async () => {
      const response = await supertest(app).get("/api/articles/1/comments");
      const {
        status,
        body: { comments },
      } = response;
      expect(status).toBe(200);
      expect(comments).toHaveLength(0);
    });
    test("400: returns bad request when passed an invalid article_id", async () => {
      const response = await supertest(app).get(
        "/api/articles/invalid/comments"
      );
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("invalid article id");
    });
    test("404: returns when passed a valid id but the article doesn't exists", async () => {
      const response = await supertest(app).get("/api/articles/10/comments");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(404);
      expect(msg).toBe("article does not exist");
    });
  });
  describe("POST /api/articles/comments", () => {
    test("201: returns the posted comment", async () => {
      const commentToPost = {
        author_id: 4,
        body: "its been a while since I listened to that EP, I should go back to it",
        article_id: 3,
      };
      const response = await supertest(app)
        .post("/api/articles/comments")
        .send(commentToPost);
      const {
        status,
        body: { comment },
      } = response;
      expect(status).toBe(201);
      expect(comment.article_id).toBe(3);
      expect(comment.body).toBe(commentToPost.body);
      expect(comment.comment_id).toBe(4);
      expect(new Date(comment.created_at)).toEqual(expect.any(Date));
      expect(comment.author_id).toBe(4);
    });
    test("400: when attempting to post with missing fields", async () => {
      const commentToPost = { author_id: 2, body: "no article_id" };
      const response = await supertest(app)
        .post("/api/articles/comments")
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
        body: "no article_id",
        article_id: 3,
      };
      const response = await supertest(app)
        .post("/api/articles/comments")
        .send(commentToPost);
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(400);
      expect(msg).toBe("Bad request");
    });
    test("400: posting a comment with an article_id that doesn't exist in the db", async () => {
      const commentToPost = {
        author_id: 2,
        body: "non existent article_id",
        article_id: 50,
      };
      const response = await supertest(app)
        .post("/api/articles/comments")
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
        expect(typeof like.article_id).toBe("number");
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
      const likeObjectToPost = { user_id: 1, article_id: 3, value: 1 };
      const response = await supertest(app)
        .post("/api/likes")
        .send(likeObjectToPost);

      const {
        status,
        body: { like },
      } = response;
      expect(status).toBe(201);
      expect(like).toEqual({ like_id: 3, user_id: 1, article_id: 3, value: 1 });
    });
    test("400: when trying to post a like to an article that already has a like by that user", async () => {
      const likeObjectToPost = { user_id: 1, article_id: 1, value: 1 };
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
      const likeObjectToPost = { user_id: 1, article_id: 3, value: 2 };
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
      const likeToPost = { user_id: 5, article_id: 3, value: 1 };
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
