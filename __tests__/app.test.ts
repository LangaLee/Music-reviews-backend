import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import app from "../app";
import supertest from "supertest";
import { returnedUsers, returnedTopics, returnedArticles } from "../TS types";
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
  describe("api/docs", () => {
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
  describe("api/users", () => {
    test("200: returns users on a key of users", async () => {
      const response = await supertest(app).get("/api/users");
      const {
        body: { users },
        status,
      } = response;
      expect(status).toBe(200);
      expect(users.length).toBe(4);
      users.forEach((user: returnedUsers) => {
        expect(user.user_id).toEqual(expect.any(Number));
        expect(new Date(user.created_at)).toEqual(expect.any(Date));
        expect(user.profile_pic_url).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
      });
    });
  });
  describe("/api/notFound", () => {
    test("500: returns and object with a key of msg", async () => {
      const response = await supertest(app).get("/api/lee");
      const {
        status,
        body: { msg },
      } = response;
      expect(status).toBe(500);
      expect(msg).toBe("Endpoint not found");
    });
  });
  describe("api/topics", () => {
    test("200: returns available topics", async () => {
      const response = await supertest(app).get("/api/topics");
      const {
        status,
        body: { topics },
      } = response;
      expect(status).toBe(200);
      expect(topics.length).toBe(4);
      topics.forEach((topic: returnedTopics) => {
        expect(topic.topic_id).toEqual(expect.any(Number));
        expect(topic.topic_name).toEqual(expect.any(String));
        expect(topic.description).toEqual(expect.any(String));
      });
    });
  });
  describe("api/articles", () => {
    test("200: returns all available articles", async () => {
      const response = await supertest(app).get("/api/articles");
      const {
        status,
        body: { articles },
      } = response;
      expect(status).toBe(200);
      expect(articles.length).toBe(3);
      articles.forEach((article: returnedArticles) => {
        expect(article.article_id).toEqual(expect.any(Number));
        expect(article.article_image_url).toEqual(expect.any(String));
        expect(article.author.username).toEqual(expect.any(String));
        expect(new Date(article.created_at)).toEqual(expect.any(Date));
        expect(article.dislikes).toEqual(expect.any(Number));
        expect(article.likes).toEqual(expect.any(Number));
        expect(article.title).toEqual(expect.any(String));
        expect(article.topic.topic_name).toEqual(expect.any(String));
      });
    });
  });
});
