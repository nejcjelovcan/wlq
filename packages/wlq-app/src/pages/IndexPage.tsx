import React from 'react'
import Link from 'next/link'
import { Skeleton, Stack, Button } from '@chakra-ui/core'
import PageHead from '../components/PageHead'
import { useOvermind } from '../overmind'
import useToken from '../hooks/useToken'

const FauxRoom = () => <Skeleton height="2rem" />

const IndexPage = () => {
  useToken()
  const {
    actions: {
      user: { clearUserData },
    },
  } = useOvermind()
  return (
    <>
      <Stack spacing={4}>
        <PageHead title="Hello!" />
        <Stack spacing={2}>
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
          <FauxRoom />
        </Stack>
        <Link href="/new/" passHref>
          <Button as="a" size="lg">
            New Game
          </Button>
        </Link>
        <Link href="/settings/" passHref>
          <Button as="a" size="lg">
            Settings
          </Button>
        </Link>
        <Button size="lg" onClick={() => clearUserData()}>
          Clear data
        </Button>
      </Stack>
    </>
  )
}
export default IndexPage
