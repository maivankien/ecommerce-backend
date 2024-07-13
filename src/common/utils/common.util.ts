import * as _ from 'lodash';


export const getInfoData = (fields: string[], object: object) => {
    return _.pick(object, fields)
}