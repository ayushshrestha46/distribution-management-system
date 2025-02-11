import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/dbconnect.js'
import http from 'http'
import app from './app.js'

const server = http.createServer(app);

connectDB()
  .then(() => {
    server.on('error', (error) => {
      console.log('Err:', error);
      throw error;
    });
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('DataBase Connection Failed: || ', err);
  });
