import { Link } from "react-router-dom";

const dashboardPath = "/";

const Dashboard = function () {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/forum"> forum </Link>
    </div>
  );
};

export { dashboardPath };
export default Dashboard;
