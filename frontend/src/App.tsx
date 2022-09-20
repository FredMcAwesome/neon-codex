import Forum, { forumPath } from "./components/forum/Forum.js";
import Login from "./components/login/Login.js";
import Dashboard, { dashboardPath } from "./components/dashboard/Dashboard.js";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute.js";
import { loginPath } from "./components/login/Login.js";
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "./components/login/loginHelper.js";

function App() {
  const { isLoading } = useQuery(["authenticationStatus"], isAuthenticated);

  if (isLoading) {
    // need to return routes here to allow for testing with a different router
    return (
      <Routes>
        <Route path="*" element={<p>Loading...</p>} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        {/* Children of Routes need to be Route component so need to have 
              this cumbersome format for routes to allow redirect */}
        <Route
          path={dashboardPath}
          element={<PrivateRoute outlet={<Dashboard />} />}
        />
        <Route path={forumPath} element={<PrivateRoute outlet={<Forum />} />} />

        <Route path={loginPath} element={<Login />} />
      </Routes>
    );
  }
}

export default App;
