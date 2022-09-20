// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import { Navigate } from "react-router-dom";
import { loginPath } from "../components/login/Login.js";
import { getUserSession } from "../components/login/loginHelper.js";

export type ProtectedRouteProps = {
  outlet: JSX.Element;
};

const PrivateRoute = ({ outlet }: ProtectedRouteProps) => {
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

export default PrivateRoute;
