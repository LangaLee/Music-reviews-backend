const app = require("./app.ts");

const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  console.log(`listing on ${PORT}!!!`);
});
