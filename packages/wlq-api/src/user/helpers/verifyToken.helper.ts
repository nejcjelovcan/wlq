import { JWK, JWT } from 'jose'
import { TokenVerifier } from '..'

const KEY = JWK.asKey(process.env.API_OCT_SECRET_KEY!)

const verifyToken: TokenVerifier = async token => {
  return new Promise<string>((resolve, reject) => {
    try {
      console.log('verifying token', token)
      const decoded = JWT.verify(token, KEY)
      console.log('token decoded', decoded)

      if (decoded['sub']) {
        return resolve(decoded['sub'])
      }
    } catch (err) {
      console.error('Verify error', err)
    }
    return reject('Unauthorized')
  })
}
export default verifyToken
