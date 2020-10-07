import DynamoDB from 'aws-sdk/clients/dynamodb'

export type DatabaseProps = {
  DB: DynamoDB.DocumentClient
  TableName: string
}
