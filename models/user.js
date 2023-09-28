import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({

    name:String,
    email: {
        type: String,
        unique: true,
    },
    password:String,
    address:String,
    phone:String,
    auth_token:String,
    role:String
    })
    const User = mongoose.model('user', userSchema);

    export default User;