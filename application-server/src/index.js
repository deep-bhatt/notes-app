// load .env variables
require('dotenv').config()

const express = require('express');
const app = express();
const PORT = 8080;
const { setupTables } = require('./services/bootstrap');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

app.use(express.json());
app.use(authRoutes);
app.use(notesRoutes);

setupTables().then(() => {
  console.log('database bootstrap successful');
  app.listen(PORT, () => {
    console.log(`server listning on port ${PORT}`);
  })
});

app.get('/', (req, res) => {
  res.json({success: true});
})

