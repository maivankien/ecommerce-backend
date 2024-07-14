import { Response } from "express"
import { HttpStatus } from "@nestjs/common"

export const CreatedResponse = (res: Response, message: string, data: object = null, options: object = null) => {
    return res.status(HttpStatus.CREATED).json({
        message: message,
        data: data,
        options: options
    })
}

export const SuccessResponse = (res: Response, message: string, data: object = null, options: object = null) => {
    return res.status(HttpStatus.OK).json({
        message: message,
        data: data,
        options: options
    })
}