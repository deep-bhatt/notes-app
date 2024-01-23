// load .env variables
require('dotenv').config()

const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = 8080;
const { setupTables } = require('./services/bootstrap');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const cors = require('cors');
const corsOptions = {
  // react FE app
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(helmet());
app.use(cors(corsOptions));
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

