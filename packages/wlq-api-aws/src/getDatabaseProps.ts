import DynamoDB from 'aws-sdk/clients/dynamodb'
import { DatabaseProps } from './DatabaseProps'

const getDatabaseProps = (): DatabaseProps => {
  return {
    DB: new DynamoDB.DocumentClient(),
    TableName: process.env.ROOM_TABLE_NAME!,
  }
}
export default getDatabaseProps
