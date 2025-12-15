import { Link } from "react-router-dom";
import { forumPath } from "../forum/Forum.js";
import { ArwesCard } from "../common/ArwesCard.js";
import { ArwesButton } from "../common/ArwesButton.js";
import { useTheme } from "../../context/ThemeContext.js";
import { ArwesSelect } from "../common/ArwesSelect.js";
import type { ThemeName } from "../../themes.js";

const dashboardPath = "/";

const Dashboard = function () {
  const { themeName, setTheme, availableThemes } = useTheme();

  return (
    <div style={{ padding: "20px" }}>
      <ArwesCard title="Dashboard">
        <p>Welcome to Neon Codex.</p>

        <div
          style={{ marginTop: "20px", marginBottom: "20px", maxWidth: "300px" }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "var(--arwes-palette-secondary-main)",
            }}
          >
            System Theme:
          </label>
          <ArwesSelect
            value={themeName}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link to={forumPath}>
            <ArwesButton>Go to Forum</ArwesButton>
          </Link>
        </div>
      </ArwesCard>
    </div>
  );
};

export { dashboardPath };
export default Dashboard;
