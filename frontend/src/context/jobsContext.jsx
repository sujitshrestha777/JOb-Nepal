import React, { useState } from "react";
import { JobsContext } from "./Context";

// Context provider
const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  return (
    <JobsContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
};
export default JobsProvider;
