import { BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import { isValidObjectId, Types } from 'mongoose';


type AnyObject = { [key: string]: any }

export const getInfoData = (fields: string[], object: object) => {
    return _.pick(object, fields)
}

export const getSelectData = (select: string[]): { [key: string]: 1 } => {
    return Object.fromEntries(select.map((el => [el, 1])))
}

export const unGetSelectData = (select: string[]): { [key: string]: 0 } => {
    return Object.fromEntries(select.map((el => [el, 0])))
}


export const removeAttrUndefined = (object: AnyObject): AnyObject => {
    Object.keys(object).forEach(key => {
        if (object[key] === undefined || object[key] === null) {
            delete object[key]
        }
    })

    return object
}

export const updateNestedObjectParser = (obj: AnyObject): AnyObject => {
    const final: AnyObject = {}

    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
            const response = updateNestedObjectParser(obj[i])
            Object.keys(response).forEach(j => {
                final[`${i}.${j}`] = response[j]
            })
        } else {
            final[i] = obj[i]
        }
    })

    return final
}

export const createObjectId = (id: string) => {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ObjectId.')
    }

    return new Types.ObjectId(id)
}
