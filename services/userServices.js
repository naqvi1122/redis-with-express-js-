import User from '../models/user.js';
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { getUserIdFromToken } from '../utilities/authentication.js';


import { createClient } from 'redis';

import { PollyClient, DeleteLexiconCommand, StartSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly'
const credentials = {
    accessKeyId: "AKIARUIO25LGPG655F7N",
    secretAccessKey: "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",
};
const config = {
    credentials,
    region: "us-east-2",
    endpoint: "https://polly.us-east-2.amazonaws.com",
};
const client = new PollyClient(config);




const redisClient =await createClient() .on('error', err => console.log('Redis Client Error', err))
.connect();

async function userLogin(req) {
    const { name, email, password, address, phone } = req.body
    let checkuser = await User.findOne({ email: email })
    if (checkuser) {
        return {
            status: false,
            message: `user is already register `,

        }
    }

    console.log(name)
    const hashedpass = await bcrypt.hash(password, 10);
    const createuser = User({
        name: name,
        email: email,
        password: hashedpass,
        address,
        phone

    })
    await createuser.save()
    console.log('user', createuser)
    const payload = {
        userId: createuser._id,
        email: createuser.email
    };
    try {
        // if (!redisClient.connect()) {
        //     await redisClient.connect();
        //   }
        
        const token = await jwt.sign(payload, process.env.JWT_SECRET);
      console.log('userdetaillllll',createuser._id)
      let key=createuser._id.toString();
        redisClient.set(key,token)
      
        createuser.auth_token = token;
        await createuser.save();
      
        console.log('JWT token:', token);
    } catch (err) {
        console.error('JWT signing or saving error:', err);
    }

    return {
        status: true,
        message: `Register  in successfully`,
        data: { createuser }
    }
}


const login = async (req) => {
    try {

        const { email, password } = req.body
        let checkuser = await User.findOne({ email: email })
        if (checkuser) {
            let match = await bcrypt.compare(password, checkuser.password)
            if (match) {
                let user = await User.findOne({ email: email }).select('-password');
                return {
                    status: true,
                    message: `user login  `,
                    data: user
                }
            } else {
                return {
                    status: false,
                    message: `login credentials issue`,
                }
            }
        } else {
            return {
                status: false,
                message: `User is not found or auth issue`,
            }
        }

    } catch (error) {

        return {
            status: false,
            message: error,

        }

    }

}

const updateUser = async (req) => {
    try {
        const { name, address, phone, password } = req.body
        let u_id = await getUserIdFromToken(req)
        let checkuser = await User.findOne({ _id: u_id })
        let hashedpass
        if (password) {
            hashedpass = await bcrypt.hash(password, 10);
        }
        if (checkuser) {
            checkuser.name = name || checkuser.name,
                checkuser.address = address || checkuser.address,
                checkuser.phone = phone || checkuser.phone,
                checkuser.password = hashedpass || checkuser.password,
                await checkuser.save()
            return {
                status: true,
                message: `User data is updated`,
            }
        } else {
            return {
                status: false,
                message: `User is not found`,
            }
        }

    } catch (error) {

        return {
            status: false,
            message: error,

        }

    }



}

const userCompleteDetail = async (req) => {

    try {

        let u_id = await getUserIdFromToken(req)
        console.log('idididiididi', u_id)

        let checkuser = await User.findOne({ _id: u_id }).select('-password')
        if (checkuser) {
            return {
                status: true,
                message: "User Complete Detail ",
                data: checkuser

            }


        } else {

            return {
                status: false,
                message: "User is not Found",

            }

        }


    } catch (error) {


        return {
            status: false,
            message: error,

        }

    }


}



const updatePassword = async (req) => {
    try {
        const { password } = req.body

        let u_id = await getUserIdFromToken(req)
        let checkuser = await User.findOne({ _id: u_id })
        if (checkuser) {


            let hashedpass
            if (password) {
                hashedpass = await bcrypt.hash(password, 10);
            }
            checkuser.password = hashedpass || checkuser.password,
                await checkuser.save()

            return {
                status: true,
                message: "User Password Is Updated",

            }


        } else {

            return {
                status: false,
                message: "User is not found ",

            }


        }

    } catch (error) {

        return {
            status: false,
            message: error,

        }

    }
}

const textToVoice = async (req) => {
    try {
        console.log('clickedddd')
      const { text } = req.body;
   
  
    //   const params = {
    //     OutputFormat: 'mp3',
    //     Text: text,
    //     VoiceId: 'Joanna',
    //   };

    const input = { // StartSpeechSynthesisTaskInput
        Engine:"neural",
        LanguageCode:  "en-US" ,
     
        OutputFormat:  "mp3",
   
     
     
       
      
        Text: text, // required
        TextType: "text",
        VoiceId: "Aditi", // required
      };
  
      const command = new StartSpeechSynthesisTaskCommand(input);
      const response = await client.send(command);
      console.log('kkkkk',response)
      return {
        status: true,
        message: 'Audio',
        data:response,
      };
    } catch (error) {
        console.log('errorrrrr',error)
      return {
        status: false,
        message: error,
      };
    }
  };
export { userLogin, login, updateUser, userCompleteDetail, updatePassword ,textToVoice}