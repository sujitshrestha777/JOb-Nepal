import React, { useState } from "react";
import { SearchContext } from "./Context";

// Context provider
const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;
