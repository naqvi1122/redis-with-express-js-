import * as userServices from '../services/userServices.js'
import responseUtil from '../utilities/response.js'


const loginUser = async (req, res) => {
    const response = await userServices.userLogin(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const login = async (req, res) => {
    const response = await userServices.login(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUser = async (req, res) => {
    const response = await userServices.updateUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const userCompleteDetail = async (req, res) => {
    const response = await userServices.userCompleteDetail(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updatePassword = async (req, res) => {
    const response = await userServices.updatePassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const textToVoice = async (req, res) => {
    const response = await userServices.textToVoice(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_detail: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}


export{loginUser,login,updateUser,userCompleteDetail,updatePassword,textToVoice}