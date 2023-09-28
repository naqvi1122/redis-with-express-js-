import * as adminServices from '../services/adminServices.js'
import responseUtil from '../utilities/response.js'


const getAllUser = async (req, res) => {
    const response = await adminServices.getAllUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const createRole = async (req, res) => {
    const response = await adminServices.createRole(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}









export{getAllUser,createRole}