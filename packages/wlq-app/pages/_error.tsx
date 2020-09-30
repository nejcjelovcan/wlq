import React from 'react'
import ErrorPage from '../src/pages/ErrorPage'

export default function Error({ statusCode }) {
  return <ErrorPage statusCode={statusCode} />
}

export const getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
