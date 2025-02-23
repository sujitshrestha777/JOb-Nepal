import axios from "axios";

export const applyApplication = async (finalData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/application/apply",
      finalData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
        },
      }
    );

    if (response.status === 201) {
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
