import { JWK, JWT } from 'jose'
import { nanoid } from 'nanoid'
import Response from '../rest/Response'

export type GetTokenResponseData = { token: string }

const KEY = JWK.asKey(process.env.API_OCT_SECRET_KEY!)

const getToken = (): Response<GetTokenResponseData> => ({
  statusCode: 200,
  data: {
    token: JWT.sign({ sub: nanoid() }, KEY),
  },
})
export default getToken
