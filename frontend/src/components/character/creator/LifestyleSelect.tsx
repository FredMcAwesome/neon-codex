import type { LifestyleSelectedListType } from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { trpc } from "../../../utils/trpc.js";
import Dropdown from "react-dropdown";

interface IProps {
  lifestyleSelections: LifestyleSelectedListType;
  setLifestyleSelections: (
    loadingLifestyleList: LifestyleSelectedListType
  ) => void;
}

export const LifestyleSelect = function ({
  lifestyleSelections,
  setLifestyleSelections,
}: IProps) {
  const lifestyleList = trpc.character.lifestyles.useQuery();
  const lifestyleQualityList = trpc.character.lifestyleQualities.useQuery();

  if (
    lifestyleList.data === undefined ||
    lifestyleQualityList.data === undefined
  ) {
    return <></>;
  }

  if (lifestyleList.isLoading) {
    return <span>Loading...</span>;
  }
  if (lifestyleList.isError) {
    return <span>Error: {lifestyleList.error.message}</span>;
  }
  if (lifestyleQualityList.isLoading) {
    return <span>Loading...</span>;
  }
  if (lifestyleQualityList.isError) {
    return <span>Error: {lifestyleQualityList.error.message}</span>;
  }

  return (
    <div>
      <h1>Lifestyle Selection</h1>
      <h3>Add Lifestyle</h3>
      <Dropdown
        options={lifestyleList.data.map((lifestyle) => {
          return lifestyle.name;
        })}
        value={""}
        onChange={(arg) => {
          const sourceLifestyle = lifestyleList.data.find((lifestyle) => {
            return lifestyle.name === arg.value;
          });
          if (sourceLifestyle === undefined) {
            throw new Error(`Lifestyle: ${arg.value} not found`);
          }
          const newLifestyleSelections = lifestyleSelections;
          newLifestyleSelections.push({
            lifestyle: sourceLifestyle,
            lifestyleQualityList: [],
            purchasedDuration: 0,
          });
          setLifestyleSelections(newLifestyleSelections);
        }}
      />
      {lifestyleSelections !== undefined &&
        lifestyleSelections.map((lifestyle, index) => {
          const cost =
            lifestyle.lifestyle.cost.increment +
            " Cost: " +
            lifestyle.lifestyle.cost.cost.toString();

          const lifestylePoints =
            lifestyle.lifestyle.lifestylePoints -
            lifestyle.lifestyleQualityList.reduce((total, qualityCost) => {
              return total + qualityCost.lifestylePointCost;
            }, 0);

          return (
            <div>
              <div>Lifestyle: {lifestyle.lifestyle.name}</div>
              <div>
                Description:
                <div>{cost}</div>
              </div>
              <div>Lifestyle Qualities:</div>{" "}
              <Dropdown
                options={lifestyleQualityList.data.map((quality) => {
                  return quality.name;
                })}
                value={""}
                onChange={(arg) => {
                  const sourceLifestyleQuality = lifestyleQualityList.data.find(
                    (quality) => {
                      return quality.name === arg.value;
                    }
                  );
                  if (sourceLifestyleQuality === undefined) {
                    throw new Error(
                      `Lifestyle Quality: ${arg.value} not found`
                    );
                  }
                  const qualityList = lifestyle.lifestyleQualityList.concat(
                    sourceLifestyleQuality
                  );
                  const newLifestyleSelections = lifestyleSelections;
                  newLifestyleSelections[index] = {
                    lifestyle: lifestyle.lifestyle,
                    lifestyleQualityList: qualityList,
                    purchasedDuration: lifestyle.purchasedDuration,
                  };
                  setLifestyleSelections(newLifestyleSelections);
                }}
              />
              <div>
                Selected Lifestyle Qualities: Count:{" "}
                {lifestyle.lifestyleQualityList.length}
                <div>
                  Points: {lifestylePoints}/
                  {lifestyle.lifestyle.lifestylePoints}
                </div>
                <ul>
                  {lifestyle.lifestyleQualityList.map((quality) => {
                    return (
                      <li key={quality.name + lifestyle.lifestyle.name}>
                        <div>Name: {quality.name}</div>
                        <div>
                          Lifestyle Point Cost: {quality.lifestylePointCost}
                        </div>
                        <button
                          onClick={() => {
                            const newQualityList =
                              lifestyle.lifestyleQualityList.filter(
                                (sourceQuality) => {
                                  return sourceQuality.name !== quality.name;
                                }
                              );
                            const newLifestyleSelections = lifestyleSelections;
                            newLifestyleSelections[index] = {
                              lifestyle: lifestyle.lifestyle,
                              lifestyleQualityList: newQualityList,
                              purchasedDuration: lifestyle.purchasedDuration,
                            };
                            setLifestyleSelections(newLifestyleSelections);
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
    </div>
  );
};
