import axios from "axios";

export const postJob = async (finalData) => {
  try {
    console.log("Inside api callll payload", finalData);
    const jobpost = {
      ...finalData,
      salary: Number(finalData.salary),
    };
    console.log("Inside api callll jobpost", jobpost);
    const response = await axios.post(
      "http://localhost:5000/api/job",
      jobpost,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
        },
      }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.log(error);
    throw handleError(error);
  }
};

const handleError = (error) => {
  return {
    message: error.response?.data?.message || "An error occurred",
    status: error.response?.status,
  };
};
