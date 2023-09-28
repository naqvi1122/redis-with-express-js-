
import * as userRoute from './user_route.js'
import * as adminRoute from './admin_route.js'
import express from 'express'

const router = express.Router()

router.use('/user', userRoute.router)
router.use('/admin', adminRoute.router)

export { router }