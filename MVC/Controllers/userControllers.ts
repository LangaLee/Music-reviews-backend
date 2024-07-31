import findUsers from "../Models/userModels";
import express from "express";
async function getUsers(req: express.Request, res: express.Response) {
  const users = await findUsers();
  res.status(200).send({ users });
}

export default getUsers;
