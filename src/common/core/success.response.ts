import { Response } from "express"
import { HttpStatus } from "@nestjs/common"

const MESSAGE_CREATED = "Created"
const MESSAGE_SUCCESS = "Success"

export const CreatedResponse = (res: Response, message: string = MESSAGE_CREATED, data: object = null, options: object = null) => {
    return res.status(HttpStatus.CREATED).json({
        message: message,
        data: data,
        options: options
    })
}

export const SuccessResponse = (res: Response, message: string = MESSAGE_SUCCESS, data: object = null, options: object = null) => {
    if (Array.isArray(data) && data.length === 0) {
        data = null
    }

    return res.status(HttpStatus.OK).json({
        message: message,
        data: data,
        options: options
    })
}