import findUsers from "../Models/userModels";
async function getUsers(req, res) {
  const users = await findUsers();
  res.status(200).send({ users });
}

export default getUsers;
