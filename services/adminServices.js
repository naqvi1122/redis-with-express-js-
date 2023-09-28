import User from '../models/user.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function createAdminUser() {
    const email = 'admin@admin.com';
    const password = '123456'; 
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const adminUser = new User({
        email,
      password: hashedPassword,
      role: 'admin',
    });
  
    try {
      await adminUser.save();

      const payload = {
        userId: adminUser._id,
        email: adminUser.email,
        role:adminUser.role
    };
    try {
        const token = await jwt.sign(payload, process.env.JWT_SECRET);
        adminUser.auth_token = token;
        await adminUser.save();
        console.log('JWT token:', token);
    } catch (err) {
        console.error('JWT signing or saving error:', err);
    }
      console.log('Admin user created successfully');
    } catch (error) {
    //   console.error('Error creating admin user:', error);
    }
  }










const getAllUser=async()=>{

  try {
    

    let allUser=await User.find({}).select('-password -__v -auth_token')

    return {
        status: true,
        message: `All User Details `,
        data:allUser

    }




  } catch (error) {

    return {
        status: false,
        message: error,
    }
    
  }
}

const createRole=async(req)=>{
    try {
        
const{role,u_id}=req.body
let user=await User.findOne({_id:u_id}).select('-password')
if(user){
    user.role = role || user.role
    await user.save()

    
    return {
        status: true,
        message: `user Role is created `,
        data:user

    }
}




    } catch (error) {


        return {
            status: false,
            message: error,
        }
        
    }
}







export { getAllUser,createRole,createAdminUser }