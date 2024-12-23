import express from "express";
import fs from "fs/promises";
async function getDoc(req: express.Request, res: express.Response) {
  const docs = await fs.readFile(
    `${__dirname}/../../documentation/endpoints.json`,
    "utf-8"
  );
  res.status(200).send({ docs: JSON.parse(docs) });
}

export default getDoc;
