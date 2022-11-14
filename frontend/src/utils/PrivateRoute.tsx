// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import { Navigate } from "react-router-dom";
import { dashboardPath } from "../components/dashboard/Dashboard.js";
import LoginRoute, { loginPath } from "../components/login/Login.js";
import { getUserSession } from "../components/login/loginHelper.js";

export type ProtectedRouteProps = {
  outlet: JSX.Element;
};

const PrivateRoute = function ({ outlet }: ProtectedRouteProps) {
  const { token } = getUserSession();
  // assume userSession is up to date later redirect to login page
  // if server responds with authentication failed for any request
  if (!token || token.length == 0) {
    console.log("Not logged in");
    return <Navigate to={{ pathname: loginPath }} />;
  } else {
    return outlet;
  }
};

const Login = function () {
  const { token } = getUserSession();

  /* Direct any login requests to dashboard if already logged in */
  if (token && token.length !== 0) {
    console.log("already logged in");
    return <Navigate to={{ pathname: dashboardPath }} />;
  } else {
    return <LoginRoute />;
  }
};

export { PrivateRoute, Login };
