import type { CharacterSummaryType } from "@neon-codex/common";
import { trpc } from "../../utils/trpc.js";
import { heritageCategoryEnum } from "@neon-codex/common";
import { Link } from "react-router-dom";
import { ArwesCard } from "../common/ArwesCard.js";
import { ArwesButton } from "../common/ArwesButton.js";
const characterListPath = "/characters/";

const CharacterList = function () {
  const { data, error, isError, isPending } =
    trpc.character.getCharacterList.useQuery();

  if (isPending) {
    return <div>Loading character list...</div>;
  }

  if (isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Characters</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {data.length > 0
          ? data.map((character) => (
              <CharacterCard data={character} key={character.id} />
            ))
          : "No characters created"}
      </div>
    </div>
  );
};
export { characterListPath };
export default CharacterList;

function CharacterCard({ data }: { data: CharacterSummaryType }) {
  return (
    <Link
      to={characterListPath + data.id}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <ArwesCard title={data.name}>
        <div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ opacity: 0.7 }}>Heritage: </span>
            {data.heritage.category === heritageCategoryEnum.Metavariant
              ? data.heritage.baseHeritage + "/" + data.heritage.name
              : data.heritage.name}
          </div>
          <ArwesButton>View Sheet</ArwesButton>
        </div>
      </ArwesCard>
    </Link>
  );
}
