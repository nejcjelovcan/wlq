import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi'

const getWebsocketApiGateway = ((cache: {
  [key: string]: ApiGatewayManagementApi
}) => (websocketEndpoint: string): ApiGatewayManagementApi => {
  if (!cache[websocketEndpoint]) {
    cache[websocketEndpoint] = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: websocketEndpoint,
    })
  }
  return cache[websocketEndpoint]
})({})

export default getWebsocketApiGateway
