import { ArwesCard } from "./common/ArwesCard.js";

export const NoMatch = function () {
  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <ArwesCard title="404" palette="error">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Page Not Found</h2>
          <p>The requested resource could not be located in the matrix.</p>
        </div>
      </ArwesCard>
    </div>
  );
};
