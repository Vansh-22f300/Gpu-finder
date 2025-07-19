const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pricingRoutes = require('./routes/pricingRoute');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

app.use('/api/pricing', pricingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
