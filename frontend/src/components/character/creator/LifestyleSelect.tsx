import type { LifestyleSelectedListType } from "@neon-codex/common";
import { trpc } from "../../../utils/trpc.js";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import { ArwesButton } from "../../common/ArwesButton.js";

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

  if (lifestyleList.isPending) {
    return <span>Loading...</span>;
  }
  if (lifestyleList.isError) {
    return <span>Error: {lifestyleList.error.message}</span>;
  }
  if (lifestyleQualityList.isPending) {
    return <span>Loading...</span>;
  }
  if (lifestyleQualityList.isError) {
    return <span>Error: {lifestyleQualityList.error.message}</span>;
  }

  return (
    <div className="lifestyle-container">
      <h1>Lifestyle Selection</h1>
      <div className="talent-item">
        <label>Add Lifestyle</label>
        <ArwesSelect
          value={""}
          onChange={(event) => {
            const arg = { value: event.target.value };
            if (!lifestyleList.data) return;
            const sourceLifestyle = lifestyleList.data.find((lifestyle) => {
              return lifestyle.name === arg.value;
            });
            if (sourceLifestyle === undefined) {
              throw new Error(`Lifestyle: ${arg.value} not found`);
            }
            const newLifestyleSelections = [...lifestyleSelections];
            newLifestyleSelections.push({
              lifestyle: sourceLifestyle,
              lifestyleQualityList: [],
              purchasedDuration: 0,
            });
            setLifestyleSelections(newLifestyleSelections);
          }}
        >
          <option value="" disabled>
            Select Lifestyle
          </option>
          {lifestyleList.data!.map((lifestyle) => (
            <option key={lifestyle.name} value={lifestyle.name}>
              {lifestyle.name}
            </option>
          ))}
        </ArwesSelect>
      </div>

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
            <div key={index} className="lifestyle-item">
              <div className="lifestyle-header">
                Lifestyle: {lifestyle.lifestyle.name}
              </div>
              <div className="lifestyle-details">Description: {cost}</div>

              <div className="talent-item">
                <label>Add Lifestyle Quality</label>
                <ArwesSelect
                  value={""}
                  onChange={(event) => {
                    const arg = { value: event.target.value };
                    if (!lifestyleQualityList.data) return;
                    const sourceLifestyleQuality =
                      lifestyleQualityList.data.find((quality) => {
                        return quality.name === arg.value;
                      });
                    if (sourceLifestyleQuality === undefined) {
                      throw new Error(
                        `Lifestyle Quality: ${arg.value} not found`
                      );
                    }
                    const qualityList = lifestyle.lifestyleQualityList.concat(
                      sourceLifestyleQuality
                    );
                    const newLifestyleSelections = [...lifestyleSelections];
                    newLifestyleSelections[index] = {
                      lifestyle: lifestyle.lifestyle,
                      lifestyleQualityList: qualityList,
                      purchasedDuration: lifestyle.purchasedDuration,
                    };
                    setLifestyleSelections(newLifestyleSelections);
                  }}
                >
                  <option value="" disabled>
                    Select Quality
                  </option>
                  {lifestyleQualityList.data!.map((quality) => (
                    <option key={quality.name} value={quality.name}>
                      {quality.name}
                    </option>
                  ))}
                </ArwesSelect>
              </div>

              <div>
                <p>
                  Selected Lifestyle Qualities: Count:{" "}
                  {lifestyle.lifestyleQualityList.length}
                </p>
                <p>
                  Points: {lifestylePoints}/
                  {lifestyle.lifestyle.lifestylePoints}
                </p>
                <ul className="lifestyle-qualities-list">
                  {lifestyle.lifestyleQualityList.map((quality, qIndex) => {
                    return (
                      <li
                        key={quality.name + lifestyle.lifestyle.name + qIndex}
                        className="lifestyle-quality-item"
                      >
                        <div>
                          <div>Name: {quality.name}</div>
                          <div style={{ fontSize: "0.8em", opacity: 0.8 }}>
                            Lifestyle Point Cost: {quality.lifestylePointCost}
                          </div>
                        </div>
                        <ArwesButton
                          palette="error"
                          onClick={() => {
                            const newQualityList =
                              lifestyle.lifestyleQualityList.filter(
                                (_sourceQuality, i) => {
                                  return i !== qIndex; // Remove by index to handle duplicates correctly if allowed
                                }
                              );
                            const newLifestyleSelections = [
                              ...lifestyleSelections,
                            ];
                            newLifestyleSelections[index] = {
                              lifestyle: lifestyle.lifestyle,
                              lifestyleQualityList: newQualityList,
                              purchasedDuration: lifestyle.purchasedDuration,
                            };
                            setLifestyleSelections(newLifestyleSelections);
                          }}
                        >
                          Remove
                        </ArwesButton>
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
