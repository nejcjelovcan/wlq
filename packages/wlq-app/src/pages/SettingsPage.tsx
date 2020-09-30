import React from 'react'
import Link from 'next/link'
import { Skeleton, Stack, Button } from '@chakra-ui/core'
import PageHead from '../components/PageHead'
import useToken from '../hooks/useToken'
import UserDetailsForm from './settingsPage/UserDetailsForm'
import { useRouter } from 'next/dist/client/router'

const SettingsPage = () => {
  useToken()
  const router = useRouter()

  // TODO security
  const next = typeof router.query.next === 'string' ? router.query.next : '/'
  return (
    <Stack spacing={4}>
      <PageHead title="Settings" />
      <UserDetailsForm onDone={() => router.push(next)} />
    </Stack>
  )
}
export default SettingsPage
