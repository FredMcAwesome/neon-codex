import { Link } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = function () {
  return (
    <header>
      <Link to={"/"}>Dashboard</Link>
      <Link to={"/forum"}>Forum</Link>
      <Link to={"/character_creator"}>Character Creator</Link>
    </header>
  );
};

export default NavigationBar;
