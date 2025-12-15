import { Link } from "react-router-dom";
import "./NavigationBar.css";
import { Animator, FrameUnderline } from "@arwes/react";
import { ArwesButton } from "../common/ArwesButton.js";
import { characterCreatorPath } from "../character/creator/CharacterCreator.js";
import { forumPath } from "../forum/Forum.js";
import { dashboardPath } from "../dashboard/Dashboard.js";
import { characterListPath } from "../character/CharacterList.js";

const NavigationBar = function () {
  return (
    <Animator>
      <header
        style={{ position: "relative", marginBottom: "20px", padding: "10px" }}
      >
        <FrameUnderline
          style={{
            // @ts-ignore
            "--arwes-frames-bg-color":
              "rgba(var(--arwes-palette-primary-main-rgb), 0.1)",
            "--arwes-frames-line-color": "var(--arwes-palette-primary-main)",
          }}
        />
        <nav className="nav-container">
          <Link to={dashboardPath}>
            <ArwesButton>Dashboard</ArwesButton>
          </Link>
          <Link to={forumPath}>
            <ArwesButton>Forum</ArwesButton>
          </Link>
          <Link to={characterCreatorPath}>
            <ArwesButton>Character Creator</ArwesButton>
          </Link>
          <Link to={characterListPath}>
            <ArwesButton>My Characters</ArwesButton>
          </Link>
        </nav>
      </header>
    </Animator>
  );
};

export default NavigationBar;
