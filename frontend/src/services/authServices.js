import axios from "axios";

export const signUp = async (userData, isEmployer) => {
  try {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      ...(isEmployer && { role: "EMPLOYER" }),
    };
    console.log("playload_________", payload);
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("jobportalID", response.data.userId);
      return "signup success";
    }
  } catch (error) {
    console.log(error);
    throw handleError(error);
  }
};

export const signIn = async (userdata) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signin",
      userdata,
      { headers: { "Content-Type": "application/json" } }
    );
    if (response.status === 200) {
      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("jobportalID", response.data.userId);

      // console.log("response data user", response.data.userId);
      // const userId = localStorage.getItem("jobportalID");
      // console.log("userId is given as from services/authservicejs", userId);
      return "signin success";
    }
  } catch (error) {
    console.log(error);
    throw handleError(error);
  }
};
export const updateEmployerProfile = async (profileData) => {
  try {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    const response = await axios.put(
      "http://localhost:5000/api/user/profile/employer",
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("jwtToken"),
        },
      }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error(error);
    throw handleError(error);
  }
};

const handleError = (error) => {
  return {
    message: error.response?.data?.message || "An error occurred",
    status: error.response?.status,
  };
};
