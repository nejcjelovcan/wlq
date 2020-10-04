import { mode } from '@chakra-ui/theme-tools'

const ButtonTheme = {
  baseStyle: { borderColor: 'white' },
  defaultProps: { size: 'lg', variant: 'outline' },
  variants: {
    vibrant(props: Record<string, any>) {
      const { colorScheme: c } = props

      return {
        bg: mode(`${c}.600`, `${c}.300`)(props),
        color: mode(`white`, `gray.800`)(props),
        _hover: { bg: mode(`${c}.700`, `${c}.400`)(props) },
        _active: { bg: mode(`${c}.700`, `${c}.400`)(props) },
      }
    },

    vibrantHover(props: Record<string, any>) {
      const { colorScheme: c } = props

      return {
        bg: 'transparent',
        color: mode(`gray.800`, `white`)(props),
        _hover: {
          color: mode(`white`, `gray.800`)(props),
          bg: mode(`${c}.600`, `${c}.300`)(props),
        },
        _active: { bg: mode(`${c}.700`, `${c}.400`)(props) },
      }
    },
  },
}
export default ButtonTheme
