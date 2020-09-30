import { extendTheme } from '@chakra-ui/core'
import Button from './components/Button.theme'

export default extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },

  components: {
    Input: {
      baseStyle: { borderColor: 'white' },
      defaultProps: { size: 'md', focusBorderColor: 'whiteAlpha.800' },
    },
    Button,
    FormLabel: { baseStyle: { fontSize: 'lg' } },
    // Stack: { defaultProps: { spacing: 10 } },
  },

  shadows: {
    outline: '0 0 0 2px rgba(255, 255, 255, 1)',
  },

  radii: {
    xl: '1rem',
    '2xl': '1.5rem',
  },
})
