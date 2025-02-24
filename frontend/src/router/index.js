import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/mainlayout";
import Home from "../pages/Home";
import UserProfile from "../pages/Userprofile";
import EmployerHome from "../pages/Employerhome";
import EmployerProfile from "../pages/Employerprofile";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/Employer-profile" element={<EmployerProfile />} />
        <Route path="/Employer-profile/:id" element={<EmployerProfile />} />
        <Route path="/Employer" element={<EmployerHome />} />
      </Route>
    </Routes>
  );
};
export default AppRouter;
