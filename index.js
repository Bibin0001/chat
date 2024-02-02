const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const server = createServer(app); 

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uriDatabase= "mongodb+srv://bobster:Quip61JwlsNy6pV9@cluster0.9gq9kzd.mongodb.net/?retryWrites=true&w=majority";

// Database connection
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uriDatabase, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
// Mongoose connection to DataBase
mongoose.connect(uriDatabase)
  .then((result) =>
    server.listen(3000, ()  => {
      console.log(`Server running at http://localhost:5000/`);
    })
  )
  .catch((err) => console.log(err));

mongoose.set('strictQuery', false);

// Routers


app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.get('/api', (req, res) => {

  res.json({ message: 'Hello from the API!' });
});

app.get('/login', (req, res) => {

  res.json({ message: 'Hello from the login!' });
});


const registerRouter = require('./routes/register')
app.use('/register', registerRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

