import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc.js";

const characterSheetPath = "/characters/:id";
export const CharacterSheet = function () {
  const { id } = useParams();
  const { data, error, isError, isLoading } =
    trpc.character.getCharacter.useQuery(id || "");

  if (isLoading) {
    return <div>Loading character...</div>;
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
      <div>Name: {data.name}</div>
      <div>
        Attributes:
        <div>Body: {data.attributes.body}</div>
        <div>Agility: {data.attributes.agility}</div>
        <div>Charisma: {data.attributes.charisma}</div>
        <div>Intuition: {data.attributes.intuition}</div>
        <div>Logic: {data.attributes.logic}</div>
        <div>Reaction: {data.attributes.reaction}</div>
        <div>Strength: {data.attributes.strength}</div>
        <div>Willpower: {data.attributes.willpower}</div>
      </div>
    </div>
  );
};
export { characterSheetPath };
