import { describe, expect, test } from "@jest/globals";
import app from "../app";
import supertest from "supertest";
import { usersReturnData } from "../TS types";

describe("Testing the server", () => {
  describe("api/users", () => {
    test("200: returns users on a key of users", async () => {
      const response = await supertest(app).get("/api/users");
      const {
        body: { users },
        status,
      } = response;
      expect(status).toBe(200);
      expect(users.length).not.toBe(0);
      console.log(users);
      // users.forEach(
      //   ({
      //     user_id,
      //     created_at,
      //     profile_pic_url,
      //     username,
      //   }: usersReturnData) => {
      //     expect(user_id).toEqual(expect.any(Number));
      //     expect(created_at).toEqual(expect.any(Date));
      //     expect(profile_pic_url).toEqual(expect.any(String));
      //     expect(username).toEqual(expect.any(String));
      //   }
      // );
    });
  });
});
