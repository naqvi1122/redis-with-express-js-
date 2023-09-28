import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import jwt_decode from 'jwt-decode'
dotenv.config()
import User from '../models/user.js';

// import redis from 'redis'
import { createClient } from 'redis';

const redisClient =await createClient() .on('error', err => console.log('Redis Client Error', err))
.connect();



const generateAccessToken = async (_payload, isAdmin) => {
    const payload = { id: _payload.id, isAdmin: isAdmin }
    return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '2d' })
}

const generateAccessTokenAutoLogin = async (_payload) => {
    const payload = { id: _payload.id }
    return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '2d' }) // 60 days expiry time
}

// const generateRefreshToken = async (_payload) => {
//     const payload = {id: _payload.id}
//     const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
//         expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY}s`
//     })
//     return {
//         refreshToken: token,
//         refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRY
//     }
// }

// (async()=>{
//     await redisClient.set('key', 'value');
//     const value = await redisClient.get('key');
//    console.log({value})

// //    await redisClient.HSET('key', 'field', 'value');
// //     await redisClient.HGETALL('key');

// })()
const verifyAuthToken = () => {
    return async (req, res, next) => {
      
        const token = req.headers['authorization']
        console.log('tokennnnn',token)
        if (!token) {
            return res.status(403).send({ message: 'Token not found' })
        } else {
            //  const tokenBody = token.slice(7)
            let tokenBody = token.split(' ');

            if (tokenBody.length >= 2) {
                const extractedToken = tokenBody[1];
                tokenBody=extractedToken
                console.log('ppppppp',extractedToken);
            } else {
                console.error('Invalid token format');
            }



            
            try {
                const decoded=jwt.verify(tokenBody, process.env.JWT_SECRET)
                console.log('cccc',decoded)
                const u_id = decoded.userId
                const value = await redisClient.get(u_id);
                if(value!=null){
                        next()
                        }else{
                     return res.status(401).send({ message: 'not valid token' })
                                }
            } catch (error) {
                return res.status(401).send({ message: 'Access denied, token expired' })
            }
        }
    }
}

const verifyAdminAuthToken = () => {
    return async (req, res, next) => {
        const token = req.headers['authorization']
        if (!token) {
            return res.status(403).send({ message: 'Token not found' })
        } else {
            const tokenBody = token.slice(7)
            const decoded = jwt_decode(tokenBody)
            console.log('decodeed data',decoded)
            if (decoded.role=='admin') {
                jwt.verify(tokenBody, process.env.JWT_SECRET, (error) => {
                    if (error) {
                        return res.status(401).send({ message: 'Access denied, token expired' })
                    }
                    next()
                })
            } else {
                return res.status(401).send({ message: 'Access denied, not a valid token' })
            }
        }
    }
}

const getUserIdFromToken = async (req) => {
    try {
        const token = req.header('authorization')
        const tokenBody = token.slice(7)
        const decoded = jwt_decode(tokenBody)
        const u_id = decoded.userId
        return u_id
    } catch (error) {
        return false
    }
}

function isAdmin() {
  
    return async (req, res, next) => {
        
        console.log('sssssss',req)
        if (req.headers=='admin') {
            // User is an admin, allow access to the route
            next();
          } else {
            // User is not an admin, return a forbidden error
            return res.status(403).json({ message: 'only admin can access this ' });
          }
    }


  }


export { generateAccessToken, verifyAuthToken, getUserIdFromToken, generateAccessTokenAutoLogin, verifyAdminAuthToken,isAdmin }
