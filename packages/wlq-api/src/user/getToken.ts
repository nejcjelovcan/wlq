import { JWK, JWT } from 'jose'
import { nanoid } from 'nanoid'
import Response from '../rest/Response'

export type GetTokenResponseData = { token: string }

const getToken = (): Response<GetTokenResponseData> => ({
  statusCode: 200,
  data: {
    token: JWT.sign(
      { uid: nanoid() },
      JWK.asKey(process.env.API_OCT_SECRET_KEY!),
    ),
  },
})
export default getToken
