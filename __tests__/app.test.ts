import { describe, expect, test } from "@jest/globals";
import app from "../app";
import supertest from "supertest";
import { usersReturnData } from "../TS types";
import fs from "fs/promises";

describe("Testing the server", () => {
  describe("api/documentation", () => {
    test("200: returns an object describing the endpoints", async () => {
      const response = await supertest(app).get("/api/docmentation");
      const documentation = await fs.readFile(
        `${__dirname}../documentation/endpoints.json`,
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
      expect(users.length).not.toBe(0);
      users.forEach((user: usersReturnData) => {
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
});
