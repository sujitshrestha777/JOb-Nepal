import axios from "axios";

export const UserprofileUpdate = async (finalData) => {
  try {
    console.log("Inside api call payload", finalData);

    // Log FormData contents for debugging
    finalData.forEach((value, key) => {
      console.log(key + ": " + value);
    });

    const response = await axios.put(
      "http://localhost:5000/api/user/profile/user",
      finalData,
      {
        headers: {
          // Remove Content-Type - axios will set it automatically with boundary for FormData
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
export const GetProfile = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/user/profile/${localStorage.getItem(
        "jobportalID"
      )}`
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
