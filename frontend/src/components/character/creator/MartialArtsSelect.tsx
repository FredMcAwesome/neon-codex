import { trpc } from "../../../utils/trpc.js";
import { Fragment, useEffect, useRef, useState } from "react";
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

export const MartialArtSelect = function (props: IProps) {
  const martialArtList = trpc.character.martialArts.useQuery();
  const techniqueList = trpc.character.martialArtTechniques.useQuery();

  // Local state
  const [localMartialArtSelected, setLocalMartialArtSelected] = useState(
    props.martialArtSelected
  );
  const [localKarmaPoints, setLocalKarmaPoints] = useState(props.karmaPoints);

  // Refs for cleanup
  const martialArtSelectedRef = useRef(localMartialArtSelected);
  const karmaPointsRef = useRef(localKarmaPoints);

  useEffect(() => {
    martialArtSelectedRef.current = localMartialArtSelected;
  }, [localMartialArtSelected]);
  useEffect(() => {
    karmaPointsRef.current = localKarmaPoints;
  }, [localKarmaPoints]);

  // Sync to parent on unmount
  useEffect(() => {
    return () => {
      props.setMartialArtSelected(martialArtSelectedRef.current);
      props.setKarmaPoints(karmaPointsRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (martialArtList.data === undefined || techniqueList.data === undefined) {
    return <></>;
  }

  const techniqueOptionList =
    localMartialArtSelected === undefined
      ? []
      : "allTechniques" in localMartialArtSelected.martialArt.techniqueList
        ? techniqueList.data.map((technique) => {
            return technique.name;
          })
        : localMartialArtSelected.martialArt.techniqueList;

  return (
    <div className="martial-arts-container">
      <h1>Martial Arts Selection</h1>
      <div className="martial-art-header">
        <div style={{ flex: 1 }}>
          <ArwesSelect
            value={
              localMartialArtSelected?.martialArt.name != null
                ? localMartialArtSelected.martialArt.name
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

              if (localMartialArtSelected !== undefined) {
                const karmaRefund =
                  localMartialArtSelected.techniqueList.length * 5;
                setLocalKarmaPoints((prev) => prev + karmaRefund);
              } else {
                setLocalKarmaPoints((prev) => prev - 7);
              }

              setLocalMartialArtSelected({
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
        {localMartialArtSelected !== undefined && (
          <ArwesButton
            palette="error"
            onClick={() => {
              if (localMartialArtSelected === undefined) {
                throw new Error("Martial Arts is undefined");
              }
              const techniqueLength =
                localMartialArtSelected.techniqueList.length;
              const karmaRefuned =
                techniqueLength > 0 ? 2 + techniqueLength * 5 : 7;
              setLocalKarmaPoints((prev) => prev + karmaRefuned);
              setLocalMartialArtSelected(undefined);
            }}
          >
            Remove
          </ArwesButton>
        )}
      </div>

      {localMartialArtSelected !== undefined && (
        <div className="martial-art-techniques">
          <h3>Techniques</h3>
          {/* Maximum of 5 techniques at character creation */}
          {localMartialArtSelected.techniqueList.length < 5 && (
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
                  if (localMartialArtSelected === undefined) {
                    throw new Error(`Martial art not found`);
                  }

                  if (localMartialArtSelected.techniqueList.length > 0) {
                    setLocalKarmaPoints((prev) => prev - 5);
                  }

                  const newTechniqueList = [
                    ...localMartialArtSelected.techniqueList,
                  ];
                  newTechniqueList.push(sourceTechnique);
                  setLocalMartialArtSelected({
                    martialArt: localMartialArtSelected.martialArt,
                    techniqueList: newTechniqueList,
                  });
                }}
              >
                <option value="" disabled>
                  Select Technique
                </option>
                {techniqueOptionList
                  .filter((technique) => {
                    return !localMartialArtSelected.techniqueList.find(
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

          {localMartialArtSelected.techniqueList.length > 0 && (
            <div>
              <p>
                Selected Techniques:{" "}
                {localMartialArtSelected.techniqueList.length} (maximum 5)
              </p>
              {localMartialArtSelected.techniqueList.map((technique) => {
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
                          if (localMartialArtSelected === undefined) {
                            throw new Error(`Martial art not found`);
                          }
                          const newTechniqueList =
                            localMartialArtSelected.techniqueList.filter(
                              (sourceTechnique) => {
                                return sourceTechnique.name !== technique.name;
                              }
                            );
                          newTechniqueList.push(sourceTechnique);
                          setLocalMartialArtSelected({
                            martialArt: localMartialArtSelected.martialArt,
                            techniqueList: newTechniqueList,
                          });
                        }}
                      >
                        {techniqueOptionList
                          .filter((localTechnique) => {
                            return (
                              !localMartialArtSelected.techniqueList.find(
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
                        if (localMartialArtSelected.techniqueList.length > 1) {
                          setLocalKarmaPoints((prev) => prev + 5);
                        }
                        const newTechniqueList =
                          localMartialArtSelected.techniqueList.filter(
                            (sourceTechnique) => {
                              return sourceTechnique.name !== technique.name;
                            }
                          );
                        setLocalMartialArtSelected({
                          martialArt: localMartialArtSelected.martialArt,
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
