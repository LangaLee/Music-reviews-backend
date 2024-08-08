import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import app from "../app";
import supertest from "supertest";
import {
  returnedUsers,
  returnedTopics,
  returnedArticles,
  returnedComments,
} from "../TS types";
import fs from "fs/promises";
import seedData from "../prisma/seed/seed";
import userData from "../prisma/data/userData";
import commentData from "../prisma/data/commentData";
import articleData from "../prisma/data/articleData";
import topicData from "../prisma/data/topicData";
beforeEach(() => {
  return seedData(userData, topicData, articleData, commentData);
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
      expect(status).toEqual(200);
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
      expect(status).toEqual(200);
      expect(users.length).toEqual(4);
      users.forEach((user: returnedUsers) => {
        expect(user.user_id).toEqual(expect.any(Number));
        expect(new Date(user.created_at)).toEqual(expect.any(Date));
        expect(user.profile_pic_url).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
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
      expect(user.id).toBe(5);
      expect(user.profile_pic_url).toBe(userToPost.profile_pic_url);
      expect(new Date(user.created_at)).toEqual(expect.any(Date));
    });
  });
  describe("GET /api/notFound", () => {
    test("500: returns and object with a key of msg", async () => {
      const response = await supertest(app).get("/api/lee");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toEqual(500);
      expect(msg).toEqual("Endpoint not found");
    });
  });
  describe("GET /api/topics", () => {
    test("200: returns available topics", async () => {
      const response = await supertest(app).get("/api/topics");
      const {
        status,
        body: { topics },
      } = response;
      expect(status).toEqual(200);
      expect(topics.length).toEqual(4);
      topics.forEach((topic: returnedTopics) => {
        expect(topic.topic_id).toEqual(expect.any(Number));
        expect(topic.topic_name).toEqual(expect.any(String));
        expect(topic.description).toEqual(expect.any(String));
      });
    });
  });
  describe("GET /api/articles", () => {
    test("200: returns all available articles", async () => {
      const response = await supertest(app).get("/api/articles");
      const {
        status,
        body: { articles },
      } = response;
      expect(status).toEqual(200);
      expect(articles.length).toEqual(3);
      articles.forEach((article: returnedArticles) => {
        expect(article.article_id).toEqual(expect.any(Number));
        expect(article.article_image_url).toEqual(expect.any(String));
        expect(article.author).toEqual(expect.any(String));
        expect(new Date(article.created_at)).toEqual(expect.any(Date));
        expect(article.dislikes).toEqual(expect.any(Number));
        expect(article.likes).toEqual(expect.any(Number));
        expect(article.title).toEqual(expect.any(String));
        expect(article.topic).toEqual(expect.any(String));
        expect(article.commentCount).toEqual(expect.any(Number));
      });
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
      expect(article_image_url).toEqual(expect.any(String));
      expect(body).toEqual(expect.any(String));
      expect(title).toEqual(expect.any(String));
      expect(author).toEqual(expect.any(String));
      expect(topic).toEqual(expect.any(String));
      expect(likes).toEqual(expect.any(Number));
      expect(dislikes).toEqual(expect.any(Number));
      expect(commentCount).toEqual(expect.any(Number));
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
        expect(comment.body).toEqual(expect.any(String));
        expect(comment.author).toEqual(expect.any(String));
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
});
