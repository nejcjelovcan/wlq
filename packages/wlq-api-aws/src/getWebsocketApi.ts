import AWS from 'aws-sdk'

const getWebsocketApi = (domainName: string | undefined, stage: string) =>
  new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `${domainName}/${stage}`,
  })
export default getWebsocketApi
