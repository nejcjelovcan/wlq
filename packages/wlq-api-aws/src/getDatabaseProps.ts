import AWS from 'aws-sdk'
import { DatabaseProps } from './DatabaseProps'

const getDatabaseProps = (): DatabaseProps => {
  return {
    DB: new AWS.DynamoDB.DocumentClient(),
    TableName: process.env.ROOM_TABLE_NAME!,
  }
}
export default getDatabaseProps
