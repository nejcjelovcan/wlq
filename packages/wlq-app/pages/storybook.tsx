import { Button, HStack, Input, Stack } from '@chakra-ui/core'
import React, { useState } from 'react'
import UserBadge from '../src/components/UserBadge'
import PageHead from '../src/components/PageHead'

const UserDetailFixture = { emoji: '🐱', alias: 'Alias', color: 'blue' }

/**
 * This is just a page to preview different widgets
 * (not gonna set up the whole real storybook ATM)
 *
 * TODO: redirect to 404 in production
 */
export default function Storybook() {
  const [showAlias, setShowAlias] = useState(true)
  const toggleAlias = () => setShowAlias(show => !show)

  return (
    <>
      <Stack spacing={4}>
        <PageHead title="Title"></PageHead>
        <HStack>
          <UserBadge
            userDetails={UserDetailFixture}
            showAlias={showAlias}
            onClick={toggleAlias}
          />
          <UserBadge
            userDetails={UserDetailFixture}
            showAlias={showAlias}
            onClick={toggleAlias}
            grayscale
          />
          <UserBadge
            userDetails={{
              ...UserDetailFixture,
              alias: 'averylongaliastotestwrapping',
            }}
            showAlias={showAlias}
            onClick={toggleAlias}
          />
        </HStack>
        <Button>Button</Button>
        <Input placeholder="Input field" />
      </Stack>
    </>
  )
}
