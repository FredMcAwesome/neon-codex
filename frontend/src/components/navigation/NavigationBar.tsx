import { Link } from "react-router-dom";
import "./NavigationBar.css";
import { characterCreatorPath } from "../character/creator/CharacterCreator.js";
import { forumPath } from "../forum/Forum.js";
import { dashboardPath } from "../dashboard/Dashboard.js";
import { characterListPath } from "../character/CharacterList.js";

const NavigationBar = function () {
  return (
    <header>
      <Link to={dashboardPath}>Dashboard</Link>
      <Link to={forumPath}>Forum</Link>
      <Link to={characterCreatorPath}>Character Creator</Link>
      <Link to={characterListPath}>My Characters</Link>
    </header>
  );
};

export default NavigationBar;
