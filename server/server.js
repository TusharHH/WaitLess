const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connection = require('./connection.js');

const adminRoutes = require('./routes/Admin.routes.js');
const serviceRoutes = require('./routes/Service.routes.js');
const userRoutes = require('./routes/User.routes.js');

const app = express();
dotenv.config();

connection();

app.use(cors());
app.use(express.json());

app.use('/api/v1/admins',adminRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/services',serviceRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

