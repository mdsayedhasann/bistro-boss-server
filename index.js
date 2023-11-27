const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

// MiddleWares
app.use(cors())
app.use(express.json())

const { ObjectId } = require('mongodb');

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
    const userCollection = client.db("bistroDb").collection("users")
    const menuCollection = client.db("bistroDb").collection("menu")
    const reviewCollection = client.db('bistroDb').collection('reviews')
    const cartCollection = client.db('bistroDb').collection('carts')
    // Database COllection End


    // Users Start 
    app.post('/users', async(req, res) => {
       const user = req.body
      //  insert email if user doesn't exists
      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query)
      if(existingUser){
        return res.send({message: 'User already exists', insertedId: null})
      }
       const result = await userCollection.insertOne(user)
       res.send(result)
    })

    app.get('/users', async(req, res) => {
      const users = await userCollection.find().toArray()
      res.send(users)
    })

    // Make role as Admin Start 
    app.patch('/users/admin/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })
    // Make role as Admin End

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })
    // Users End



    // Get Menus Start
    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray()
        res.send(result)
    })
    // Get Menus End

    // Post menu Start
    app.post('/menu', async(req, res) => {
      const item = req.body
      const result = await menuCollection.insertOne(item)
      res.send(result)
    })
    // Post menu End 

    // Delete Menu Start
    app.delete('/menu/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await menuCollection.deleteOne(query)
      res.send(result)
    })
    // Delete Menu End
    
    
    // Get Reviews Start
    app.get('/reviews', async(req, res) => {
        const cursor = await reviewCollection.find().toArray()
        res.send(cursor)
    })
    // Get Reviews End


    // Cart Started

    app.get('/carts', async(req, res) => {
      const email = req.query.email
      const query = {email: email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts', async(req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem)
      res.send(result)
    })


    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })
    // Cart Ended






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