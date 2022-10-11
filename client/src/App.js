import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Register, Landing, Error, ProtectedRoutes } from "./pages";
import { AddJob, AllJobs, Profile, Stats } from "./pages/dashboard";
import SharedLayout from "./pages/dashboard/SharedLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <SharedLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
