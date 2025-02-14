import React, { useState } from "react";
import { AuthContext } from "./Context";

// Context provider
const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("");

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
