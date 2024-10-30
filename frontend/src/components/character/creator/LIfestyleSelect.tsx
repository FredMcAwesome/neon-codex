import type { LifestyleSelectedType } from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { trpc } from "../../../utils/trpc.js";
import Dropdown from "react-dropdown";

interface IProps {
  lifestyleSelected: LifestyleSelectedType | undefined;
  setLifestyleSelected: (loadingLifestyle: LifestyleSelectedType) => void;
}

export const LifestyleSelect = function ({
  lifestyleSelected,
  setLifestyleSelected,
}: IProps) {
  const lifestyleList = trpc.character.lifestyles.useQuery();
  const lifestyleQualityList = trpc.character.lifestyleQualities.useQuery();

  if (
    lifestyleList.data === undefined ||
    lifestyleQualityList.data === undefined
  ) {
    return <></>;
  }

  const cost =
    lifestyleSelected !== undefined
      ? lifestyleSelected.lifestyle.cost.increment +
        " Cost: " +
        lifestyleSelected.lifestyle.cost.cost.toString()
      : 0;
  const lifestylePoints =
    lifestyleSelected === undefined
      ? 0
      : lifestyleSelected.lifestyle.lifestylePoints -
        lifestyleSelected.lifestyleQualityList.reduce((total, qualityCost) => {
          return total + qualityCost.lifestylePointCost;
        }, 0);

  return (
    <div>
      <h1>Lifestyle Selection</h1>
      <Dropdown
        options={lifestyleList.data.map((lifestyle) => {
          return lifestyle.name;
        })}
        value={lifestyleSelected?.lifestyle.name || ""}
        onChange={(arg) => {
          const sourceLifestyle = lifestyleList.data.find((lifestyle) => {
            return lifestyle.name === arg.value;
          });
          if (sourceLifestyle === undefined) {
            throw new Error(`Lifestyle: ${arg.value} not found`);
          }

          setLifestyleSelected({
            lifestyle: sourceLifestyle,
            lifestyleQualityList: [],
          });
        }}
      />
      {lifestyleSelected !== undefined && (
        <div>
          Description:
          <div>{cost}</div>
        </div>
      )}
      {lifestyleSelected !== undefined && (
        <div>
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
                throw new Error(`Lifestyle Quality: ${arg.value} not found`);
              }
              const qualityList = lifestyleSelected.lifestyleQualityList.concat(
                sourceLifestyleQuality
              );
              setLifestyleSelected({
                lifestyle: lifestyleSelected.lifestyle,
                lifestyleQualityList: qualityList,
              });
            }}
          />
          <div>
            Selected Lifestyle Qualities: Count:{" "}
            {lifestyleSelected.lifestyleQualityList.length}
            <div>
              Points: {lifestylePoints}/
              {lifestyleSelected.lifestyle.lifestylePoints}
            </div>
            <ul>
              {lifestyleSelected.lifestyleQualityList.map((quality) => {
                return (
                  <li key={quality.name + lifestyleSelected.lifestyle.name}>
                    <div>Name: {quality.name}</div>
                    <div>
                      Lifestyle Point Cost: {quality.lifestylePointCost}
                    </div>
                    <button
                      onClick={() => {
                        const newQualityList =
                          lifestyleSelected.lifestyleQualityList.filter(
                            (sourceQuality) => {
                              return sourceQuality.name !== quality.name;
                            }
                          );
                        setLifestyleSelected({
                          lifestyle: lifestyleSelected.lifestyle,
                          lifestyleQualityList: newQualityList,
                        });
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
      )}
    </div>
  );
};
