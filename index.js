const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
var cors = require("cors");
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectID } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.twons.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const collection = client.db("todo_app").collection("task");

    app.post("/task", async (req, res) => {
      const query = req.body;
      const result = await collection.insertOne(query);
      res.send(result);
    });
    app.get("/task", async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await collection.deleteOne(query);

      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
