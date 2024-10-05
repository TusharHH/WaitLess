const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connection = require('./connection.js');



const adminRoutes = require('./routes/Admin.routes.js');
const serviceRoutes = require('./routes/Service.routes.js');
const userRoutes = require('./routes/User.routes.js');
const tokenRoutes = require('./routes/Token.route.js');
const queueRoutes = require('./routes/Queue.routes.js');

const app = express();
dotenv.config({
  path:'.env'
});
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

connection();

app.use(cors());
app.use(express.json());

app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/queues', queueRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

