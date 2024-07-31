import findUsers from "../Models/userModels";
import express from "express";
async function getUsers(req: express.Request, res: express.Response) {
  const users = await findUsers();
  console.log(users);
  res.status(200).send({ users });
}

export default getUsers;
