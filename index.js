const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

// MiddleWares
app.use(cors())
app.use(express.json())


// Database Code Start

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbcnba5.mongodb.net/?retryWrites=true&w=majority`;

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

    // Database COllection Start
    const menuCollection = client.db("bistroDb").collection("menu")
    const reviewCollection = client.db('bistroDb').collection('reviews')
    // Database COllection End





    // Get Menus Start
    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray()
        res.send(result)
    })
    // Get Menus End

    // Get Reviews Start
    app.get('/reviews', async(req, res) => {
        const cursor = await reviewCollection.find().toArray()
        res.send(cursor)
    })
    // Get Reviews End







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Database Code End 





app.get('/', (req, res) => {
    res.send('Bistro Boss Server Is Running');
})

app.listen(port, () => {
    console.log(`Bistro Boss is sitting on port ${port}`);
})