import AWS from 'aws-sdk'

const getWebsocketApiGateway = ((cache: {
  [key: string]: AWS.ApiGatewayManagementApi
}) => (websocketEndpoint: string): AWS.ApiGatewayManagementApi => {
  if (!cache[websocketEndpoint]) {
    cache[websocketEndpoint] = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: websocketEndpoint,
    })
  }
  return cache[websocketEndpoint]
})({})

export default getWebsocketApiGateway
