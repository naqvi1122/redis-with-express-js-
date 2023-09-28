
import express from 'express'
import * as adminController from '../controller/adminController.js'
import { verifyAdminAuthToken } from '../utilities/authentication.js'
//  import { verifyAuthToken } from '../utilities/authentication.js'





const router = express.Router()





router.get('/get_all_user',verifyAdminAuthToken(),adminController.getAllUser )
router.post('/add_role',verifyAdminAuthToken(),adminController.createRole )

export {router}