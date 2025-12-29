import { trpc } from "../../../utils/trpc.js";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import { ArwesButton } from "../../common/ArwesButton.js";
import type { MartialArtSelectedType } from "@neon-codex/common";

interface IProps {
  karmaPoints: number;
  setKarmaPoints: (loadingKarma: number) => void;
  martialArtSelected: MartialArtSelectedType | undefined;
  setMartialArtSelected: (
    loadingMartialArt: MartialArtSelectedType | undefined
  ) => void;
}

export const MartialArtSelect = function ({
  karmaPoints,
  setKarmaPoints,
  martialArtSelected,
  setMartialArtSelected,
}: IProps) {
  const martialArtList = trpc.character.martialArts.useQuery();
  const techniqueList = trpc.character.martialArtTechniques.useQuery();

  if (martialArtList.data === undefined || techniqueList.data === undefined) {
    return <></>;
  }

  const techniqueOptionList =
    martialArtSelected === undefined
      ? []
      : "allTechniques" in martialArtSelected.martialArt.techniqueList
      ? techniqueList.data.map((technique) => {
          return technique.name;
        })
      : martialArtSelected.martialArt.techniqueList;

  return (
    <div className="martial-arts-container">
      <h1>Martial Arts Selection</h1>
      <div className="martial-art-header">
        <div style={{ flex: 1 }}>
          <ArwesSelect
            value={
              martialArtSelected?.martialArt.name != null
                ? martialArtSelected.martialArt.name
                : ""
            }
            onChange={(event) => {
              const arg = { value: event.target.value };
              const sourceMartialArt = martialArtList.data.find(
                (martialArt) => {
                  return martialArt.name === arg.value;
                }
              );
              if (sourceMartialArt === undefined) {
                throw new Error(`Martial art: ${arg.value} not found`);
              }

              if (martialArtSelected !== undefined) {
                const karmaRefund = martialArtSelected.techniqueList.length * 5;
                setKarmaPoints(karmaRefund + karmaPoints);
              } else {
                setKarmaPoints(karmaPoints - 7);
              }

              setMartialArtSelected({
                martialArt: sourceMartialArt,
                techniqueList: [],
              });
            }}
          >
            <option value="" disabled>
              Select Martial Art
            </option>
            {martialArtList.data.map((martialArt) => (
              <option key={martialArt.name} value={martialArt.name}>
                {martialArt.name}
              </option>
            ))}
          </ArwesSelect>
        </div>
        {martialArtSelected !== undefined && (
          <ArwesButton
            palette="error"
            onClick={() => {
              if (martialArtSelected === undefined) {
                throw new Error("Martial Arts is undefined");
              }
              const techniqueLength = martialArtSelected.techniqueList.length;
              const karmaRefuned =
                techniqueLength > 0 ? 2 + techniqueLength * 5 : 7;
              setKarmaPoints(karmaRefuned + karmaPoints);
              setMartialArtSelected(undefined);
            }}
          >
            Remove
          </ArwesButton>
        )}
      </div>

      {martialArtSelected !== undefined && (
        <div className="martial-art-techniques">
          <h3>Techniques</h3>
          {/* Maximum of 5 techniques at character creation */}
          {martialArtSelected.techniqueList.length < 5 && (
            <div className="technique-item">
              <label>Add Technique:</label>
              <ArwesSelect
                value={""}
                onChange={(event) => {
                  const arg = { value: event.target.value };
                  const sourceTechnique = techniqueList.data.find(
                    (technique) => {
                      return technique.name === arg.value;
                    }
                  );
                  if (sourceTechnique === undefined) {
                    throw new Error(
                      `Martial art technique: ${arg.value} not found`
                    );
                  }
                  if (martialArtSelected === undefined) {
                    throw new Error(`Martial art not found`);
                  }

                  if (martialArtSelected.techniqueList.length > 0) {
                    setKarmaPoints(karmaPoints - 5);
                  }

                  const newTechniqueList = martialArtSelected.techniqueList;
                  newTechniqueList.push(sourceTechnique);
                  setMartialArtSelected({
                    martialArt: martialArtSelected.martialArt,
                    techniqueList: newTechniqueList,
                  });
                }}
              >
                <option value="" disabled>
                  Select Technique
                </option>
                {techniqueOptionList
                  .filter((technique) => {
                    return !martialArtSelected.techniqueList.find(
                      (selectedTechnique) => {
                        return selectedTechnique.name === technique;
                      }
                    );
                  })
                  .map((technique) => (
                    <option key={technique} value={technique}>
                      {technique}
                    </option>
                  ))}
              </ArwesSelect>
            </div>
          )}

          {martialArtSelected.techniqueList.length > 0 && (
            <div>
              <p>
                Selected Techniques: {martialArtSelected.techniqueList.length}{" "}
                (maximum 5)
              </p>
              {martialArtSelected.techniqueList.map((technique) => {
                return (
                  <div
                    key={technique.name}
                    className="technique-item"
                    style={{ marginTop: "10px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <ArwesSelect
                        value={technique.name}
                        onChange={(event) => {
                          const arg = { value: event.target.value };
                          const sourceTechnique = techniqueList.data.find(
                            (sourceTechnique) => {
                              return sourceTechnique.name === arg.value;
                            }
                          );
                          if (sourceTechnique === undefined) {
                            throw new Error(
                              `Martial art technique: ${arg.value} not found`
                            );
                          }
                          if (martialArtSelected === undefined) {
                            throw new Error(`Martial art not found`);
                          }
                          const newTechniqueList =
                            martialArtSelected.techniqueList.filter(
                              (sourceTechnique) => {
                                return sourceTechnique.name !== technique.name;
                              }
                            );
                          newTechniqueList.push(sourceTechnique);
                          setMartialArtSelected({
                            martialArt: martialArtSelected.martialArt,
                            techniqueList: newTechniqueList,
                          });
                        }}
                      >
                        {techniqueOptionList
                          .filter((localTechnique) => {
                            return (
                              !martialArtSelected.techniqueList.find(
                                (selectedTechnique) => {
                                  return (
                                    selectedTechnique.name === localTechnique
                                  );
                                }
                              ) || technique.name === localTechnique
                            );
                          })
                          .map((tech) => (
                            <option key={tech} value={tech}>
                              {tech}
                            </option>
                          ))}
                      </ArwesSelect>
                    </div>
                    <ArwesButton
                      palette="error"
                      onClick={() => {
                        if (martialArtSelected.techniqueList.length > 1) {
                          setKarmaPoints(karmaPoints + 5);
                        }
                        const newTechniqueList =
                          martialArtSelected.techniqueList.filter(
                            (sourceTechnique) => {
                              return sourceTechnique.name !== technique.name;
                            }
                          );
                        setMartialArtSelected({
                          martialArt: martialArtSelected.martialArt,
                          techniqueList: newTechniqueList,
                        });
                      }}
                    >
                      Remove
                    </ArwesButton>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
