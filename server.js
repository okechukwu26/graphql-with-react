const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-Auth");
const app = express();
const Resolvers = require("./graphql/Resolvers/index");
const Schema = require("./graphql/Schema/index");

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept ,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "PUT"
    );
    return res.status(200).send();
  }
  next();
});
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    rootValue: Resolvers,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;
mongoose
  .connect(
    `mongodb+srv://Graphql:${process.env.MONGODB_PASSWORD}@cluster0.fm36z.mongodb.net/${process.env.MONGODB_USER}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is up on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log({ message: err });
  });
