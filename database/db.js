import mongoose from 'mongoose'
import { createAdminUser } from '../services/adminServices.js';



//local connection
const db=mongoose.connect('mongodb://127.0.0.1:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  createAdminUser()
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

export{db}