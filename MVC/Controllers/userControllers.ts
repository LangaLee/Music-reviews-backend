import { findUsers, insertUser } from "../Models/userModels";
import express from "express";
export async function getUsers(req: express.Request, res: express.Response) {
  const users = await findUsers();
  res.status(200).send({ users });
}

export async function postUser(req: express.Request, res: express.Response) {
  try {
    const data = req.body;
    const user = await insertUser(data);
    res.status(201).send({ user });
  } catch (error) {}
}
