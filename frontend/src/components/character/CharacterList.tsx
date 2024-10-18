import type { CharacterSummaryType } from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { trpc } from "../../utils/trpc.js";
import { heritageCategoryEnum } from "@neon-codex/common/build/enums.js";
import { Link } from "react-router-dom";
const characterListPath = "/characters/";

const CharacterList = function () {
  const { data, error, isError, isLoading } =
    trpc.character.getCharacterList.useQuery();

  if (isLoading) {
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
    <div>
      {data.length > 0
        ? data.map((character) => (
            <CharacterCard data={character} key={character.id} />
          ))
        : "No characters created"}
    </div>
  );
};
export { characterListPath };
export default CharacterList;

function CharacterCard({ data }: { data: CharacterSummaryType }) {
  return (
    <Link to={characterListPath + data.id}>
      <div>
        <div>Name: {data.name}</div>
        <div>
          Heritage:
          <div>
            {data.heritage.category === heritageCategoryEnum.Metavariant
              ? data.heritage.baseHeritage + "/" + data.heritage.name
              : data.heritage.name}
          </div>
        </div>
      </div>
    </Link>
  );
}
