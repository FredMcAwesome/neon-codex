import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { Animator, FrameUnderline } from "@arwes/react";
import { ArwesButton } from "../common/ArwesButton.js";
import { characterCreatorPath } from "../character/creator/CharacterCreator.js";
import { forumPath } from "../forum/Forum.js";
import { dashboardPath } from "../dashboard/Dashboard.js";
import { characterListPath } from "../character/CharacterList.js";

import { useQueryClient } from "@tanstack/react-query";
import { clearUserSession } from "../login/loginHelper.js";
import { loginPath } from "../login/Login.js";

const NavigationBar = function () {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User JWT cleared");
    clearUserSession();
    queryClient.invalidateQueries({ queryKey: ["authenticationStatus"] });
    navigate(loginPath);
  };

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
          <div style={{ marginLeft: "auto" }}>
            <ArwesButton onClick={handleLogout}>Logout</ArwesButton>
          </div>
        </nav>
      </header>
    </Animator>
  );
};

export default NavigationBar;
