import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PrivateRoute, Login } from "./utils/PrivateRoute.js";
import Forum, { forumPath } from "./components/forum/Forum.js";
import Dashboard, { dashboardPath } from "./components/dashboard/Dashboard.js";
import { loginPath } from "./components/login/Login.js";
import { isAuthenticated } from "./components/login/loginHelper.js";
import NavigationBar from "./components/navigation/NavigationBar.js";
import CharacterCreator, {
  characterCreatorPath,
} from "./components/character/creator/CharacterCreator.js";
import CharacterSheet, {
  characterSheetPath,
} from "./components/character/CharacterSheet.js";
import { NoMatch } from "./components/NoMatch.js";

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
      <>
        <NavigationBar />
        <Routes>
          {/* Children of Routes need to be Route component so need to have
          this cumbersome format for routes to allow redirect */}
          <Route
            path={dashboardPath}
            element={<PrivateRoute outlet={<Dashboard />} />}
          />
          <Route
            path={forumPath}
            element={<PrivateRoute outlet={<Forum />} />}
          />

          <Route path={loginPath} element={<Login />} />
          <Route path={characterSheetPath} element={<CharacterSheet />} />
          <Route path={characterCreatorPath} element={<CharacterCreator />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </>
    );
  }
}

export default App;
