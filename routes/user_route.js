
import express from 'express'
import * as userController from '../controller/userController.js'
 import { verifyAuthToken } from '../utilities/authentication.js'


const router = express.Router()





router.post('/register',userController.loginUser )
router.post('/login',userController.login )
router.put('/update_user',verifyAuthToken(),userController.updateUser)
router.get('/user_complete_detail',verifyAuthToken(),userController.userCompleteDetail)
router.put('/update_user_password',verifyAuthToken(),userController.updatePassword)
router.post('/text_to_voice',userController.textToVoice)
export {router}