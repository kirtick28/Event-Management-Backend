const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Database Connected ');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Server Listening on port 5000');
});
