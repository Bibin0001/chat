const { createServer } = require('http');
const cookieParser = require('cookie-parser')
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const server = createServer(app); 

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uriDatabase= "mongodb+srv://bobster:Quip61JwlsNy6pV9@cluster0.9gq9kzd.mongodb.net/?retryWrites=true&w=majority";
const requireAuth = require('./middleware/authMiddleware');

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


// Routes :  
const homeRouter = require('./routes/home.js')
app.use('/', homeRouter)

const registerRouter = require('./routes/register');
app.use('/register', registerRouter)

const loginRouter = require('./routes/login');
app.use('/login', loginRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

