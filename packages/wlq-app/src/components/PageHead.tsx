import React from 'react'
import { Box, Flex, Heading, Skeleton } from '@chakra-ui/core'
import useUserDetails from '../hooks/useUserDetails'
import UserBadge from './UserBadge'

export type PageHeadProps = {
  loading?: boolean
  title: string
  subtitle?: string
  spinner?: boolean
  onClose?: () => void
}

const PageHead = ({ loading, title, subtitle }: PageHeadProps) => {
  const userDetails = useUserDetails(false)

  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center">
      <Flex direction="row" alignItems="flex-end">
        <Box mr={2}>
          <Skeleton isLoaded={!loading}>
            <Heading>{title}</Heading>
          </Skeleton>
        </Box>

        <Skeleton isLoaded={!loading}>
          <Heading as="h2" size="lg" pb="2px">
            {subtitle}
          </Heading>
        </Skeleton>
      </Flex>
      {userDetails && <UserBadge userDetails={userDetails} />}
    </Flex>
  )
}
export default PageHead
