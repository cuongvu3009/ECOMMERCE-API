require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//	routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
//	packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//	db
const connectDB = require('./db/connect');

//	middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(cors());

//	router
app.get('/api/v1', (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);

  res.send('Cookie');
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
