import * as crypto from 'crypto';
import * as jwt from "jsonwebtoken"


export const generatePrivateAndPublicKey = (): { publicKey: string, privateKey: string } => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    })
    return { privateKey, publicKey }
}

export const createTokenPair = (payload: object, publicKey: string, privateKey: string): { accessToken: string, refreshToken: string } => {
    const accessToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1 days",
    })

    const refreshToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "7 days",
    })

    return {
        accessToken,
        refreshToken,
    }
}