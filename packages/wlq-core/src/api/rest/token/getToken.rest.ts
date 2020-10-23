import { JWK, JWT } from "jose";
import { nanoid } from "nanoid";
import IWlqLambda from "../../IWlqLambda";

const KEY = JWK.asKey(process.env.API_OCT_SECRET_KEY!);

const getToken: IWlqLambda = async (_, context) => {
  context.emitter.restResponse({
    statusCode: 200,
    payload: { token: JWT.sign({ sub: nanoid() }, KEY) }
  });
};

export default getToken;
