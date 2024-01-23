// load .env variables
require('dotenv').config()

const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = process.APP_PORT || 8080;
const { setupTables } = require('./services/bootstrap');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const cors = require('cors');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // legacy browser support
};

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

