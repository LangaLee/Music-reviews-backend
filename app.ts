import express from "express";
import getUsers from "./MVC/Controllers/userControllers";
const app = express();

app.get("/api/users", getUsers);

export default app;
