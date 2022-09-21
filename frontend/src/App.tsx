import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PrivateRoute, LoginRoute } from "./utils/PrivateRoute.js";
import Forum, { forumPath } from "./components/forum/Forum.js";
import Dashboard, { dashboardPath } from "./components/dashboard/Dashboard.js";
import { loginPath } from "./components/login/Login.js";
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

        <Route path={loginPath} element={<LoginRoute />} />
      </Routes>
    );
  }
}

export default App;
