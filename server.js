import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';

// import routes
import createAccountRouter from './routes/account/createAccount.js';
import loginRouter from './routes/account/login.js';

// add urls in the future
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const PORT = process.env.PORT || 4000;
const SERVER = process.env.SERVER || 'fohtips';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
//app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

const httpServer = http.createServer(app);

app.use('/createAccount', createAccountRouter);
app.use('/login', loginRouter);

httpServer.listen(PORT, () => {
  console.log(`server ${SERVER} is running on port ${PORT}`);
});
/*
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}, on server ${SERVER}`);
});
*/
