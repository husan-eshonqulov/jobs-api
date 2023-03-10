require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

app.use(
  cors({
    origin: 'https://jobs-api.netlify.app',
  })
);

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
