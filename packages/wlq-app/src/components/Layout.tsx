import React from 'react'
import { Box, Center, Flex } from '@chakra-ui/core'

import { FC } from 'react'

const Layout: FC = ({ children }) => {
  const width = { base: '100%', sm: '30em' }

  return (
    <Flex height="100vh" direction="column" p={3}>
      <Center>
        <Box width={width}>{children}</Box>
      </Center>
    </Flex>
  )
}
export default Layout
