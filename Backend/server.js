const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Config dotenv
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`You can also access it via http://localhost:${PORT}`);
});






