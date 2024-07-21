import * as _ from 'lodash';


export const getInfoData = (fields: string[], object: object) => {
    return _.pick(object, fields)
}

export const getSelectData = (select: string[]): { [key: string]: 1 } => {
    return Object.fromEntries(select.map((el => [el, 1])))
}

export const unGetSelectData = (select: string[]): { [key: string]: 0 } => {
    return Object.fromEntries(select.map((el => [el, 0])))
}