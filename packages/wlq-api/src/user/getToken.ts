import { JWK, JWT } from 'jose'
import { nanoid } from 'nanoid'
import { GetTokenResponseData } from '.'
import { RestResponse } from '../rest'

const KEY = JWK.asKey(process.env.API_OCT_SECRET_KEY!)

const getToken = (): RestResponse<GetTokenResponseData> => ({
  statusCode: 200,
  data: {
    token: JWT.sign({ sub: nanoid() }, KEY),
  },
})
export default getToken
