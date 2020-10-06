export type DatabaseProps = {
  DB: AWS.DynamoDB.DocumentClient
  TableName: string
}
