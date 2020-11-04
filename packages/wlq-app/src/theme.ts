import { extendTheme } from "@chakra-ui/core";
import Button from "./components/Button.theme";
import Input from "./components/Input.theme";

// See https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/foundations/sizes.ts
export default extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark"
  },

  components: {
    Input,
    Button,
    FormLabel: { baseStyle: { fontSize: "lg" } },
    UserBadge: {
      ...Button,
      baseStyle: {
        ...Button.baseStyle,
        borderRadius: "full",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: "xl",
        height: "13",
        transition: "all 0.3s ease",
        flexGrow: "0"
      }
    }
  },

  shadows: {
    outline: "0 0 0 2px rgba(255, 255, 255, 1)"
  },

  radii: {
    xl: "1rem",
    "2xl": "1.5rem"
  },

  sizes: {
    13: "3.2rem"
  },

  lineHeights: {
    13: "3.2rem"
  },

  fontSizes: {
    "35xl": "2rem"
  },

  colors: {
    customGray: {
      50: "#e8f3ff",
      100: "#cfd8e3",
      200: "#b5bdcc",
      300: "#97a3b4",
      400: "#7b899d",
      500: "#626f84",
      600: "#4b5768",
      700: "#343e4b",
      800: "#1e2530",
      900: "#070c18"
    }
  }
});
