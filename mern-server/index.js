const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello from the MERN server!');
})

// mongoDB configuration
const uri = process.env.MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a collection of documents
    const booksCollections = client.db("dheeraj-book-store").collection("books")

    // insert a book to the collection
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await booksCollections.insertOne(data);
      res.send(result);
    });

    // get all books from the collection
    app.get("/all-books", async (req, res) => {
      const books = booksCollections.find();
      const result = await books.toArray();
      res.send(result);
    });

    // update a book data
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updateBookData
        }
      }

      // update
      const result = await booksCollections.updateOne(filter, updateDoc, options);
      res.send(result);

    });

    // delete a book
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await booksCollections.deleteOne(filter);
      res.send(result);
    });

    // find by category
    app.get("/get-books", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = {category: req.query.category}
      }
      const result = await booksCollections.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); // Commented out to keep the connection alive
  }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});