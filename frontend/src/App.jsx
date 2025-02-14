import React from "react";
import { CssBaseline, GlobalStyles, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import AppRouter from "./router";
import theme from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import SearchProvider from "./context/searchContext";
import JobsProvider from "./context/jobsContext";
import AuthProvider from "./context/authContext";

function App() {
  const isLargeScreen = useMediaQuery("(min-width:1024px)");
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <JobsProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles
                styles={{
                  "#root": {
                    padding: isLargeScreen ? "8px" : "4px",
                    boxSizing: "border-box",
                  },
                }}
              />
              <AppRouter />
            </ThemeProvider>
          </JobsProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
