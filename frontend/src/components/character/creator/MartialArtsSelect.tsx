import { Fragment } from "react";
import { trpc } from "../../../utils/trpc.js";
import Dropdown from "react-dropdown";
import type { MartialArtSelectedType } from "@neon-codex/common/build/schemas/characters/characterSchemas.js";

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
    <Fragment>
      <h1>Martial Arts Selection</h1>
      <div>
        {martialArtSelected !== undefined && (
          <button
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
          </button>
        )}
        <Dropdown
          options={martialArtList.data.map((martialArt) => {
            return martialArt.name;
          })}
          value={martialArtSelected?.martialArt.name || ""}
          onChange={(arg) => {
            const sourceMartialArt = martialArtList.data.find((martialArt) => {
              return martialArt.name === arg.value;
            });
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
        />
        {martialArtSelected !== undefined && (
          <div>
            Techniques:
            {/* Maximum of 5 techniques at character creation */}
            {martialArtSelected.techniqueList.length < 5 && (
              <Dropdown
                options={techniqueOptionList.filter((technique) => {
                  return !martialArtSelected.techniqueList.find(
                    (selectedTechnique) => {
                      return selectedTechnique.name === technique;
                    }
                  );
                })}
                value={""}
                onChange={(arg) => {
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
              />
            )}
            {martialArtSelected.techniqueList.length > 0 && (
              <div>
                Selected Techniques: Count:{" "}
                {martialArtSelected.techniqueList.length} (maximum 5)
                {martialArtSelected.techniqueList.map((technique) => {
                  return (
                    <div key={technique.name}>
                      <Dropdown
                        options={techniqueOptionList.filter(
                          (localTechnique) => {
                            return (
                              !martialArtSelected.techniqueList.find(
                                (selectedTechnique) => {
                                  return (
                                    selectedTechnique.name === localTechnique
                                  );
                                }
                              ) || technique.name === localTechnique
                            );
                          }
                        )}
                        value={technique.name}
                        onChange={(arg) => {
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
                      />
                      <button
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
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};
