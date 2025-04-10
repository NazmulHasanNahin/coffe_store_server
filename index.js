const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();


// middleware 

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nahin.31g6pd7.mongodb.net/?retryWrites=true&w=majority&appName=nahin`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee")

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // update 

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })


    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const coffeeData = req.body;

      const updatedCoffee = {
        $set: {
          name: coffeeData.name,
          chef: coffeeData.chef,
          supplier: coffeeData.supplier,
          taste: coffeeData.taste,
          category: coffeeData.category,
          photourl: coffeeData.photourl,
          details: coffeeData.details,
        }
      };

      const result = await coffeeCollection.updateOne(filter, updatedCoffee, option);
      res.send(result);
    })



    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })















    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("coffe store server running")
})


app.listen(port, () => {
  console.log(`coffe server is running on port: ${port}`);
})