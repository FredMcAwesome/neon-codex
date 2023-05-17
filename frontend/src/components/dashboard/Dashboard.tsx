import { Link } from "react-router-dom";
import { forumPath } from "../forum/Forum.js";

const dashboardPath = "/";

const Dashboard = function () {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to={forumPath}> forum </Link>
    </div>
  );
};

export { dashboardPath };
export default Dashboard;
