import * as crypto from 'crypto';

export const generatePrivateAndPublicKey = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
    })
    return { privateKey, publicKey }
}