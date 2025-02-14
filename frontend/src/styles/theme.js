import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000", // Black primary color
    },
    background: {
      default: "#ffffff", // White background
    },
    text: {
      primary: "#000", // Black text color
    },
  },
});

export default theme;
