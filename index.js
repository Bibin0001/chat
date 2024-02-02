// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.get('/api', (req, res) => {

  res.json({ message: 'Hello from the API!' });
});

app.get('/login', (req, res) => {

  res.json({ message: 'Hello from the login!' });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

