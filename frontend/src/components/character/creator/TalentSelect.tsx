import type { TalentPriorityType } from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  critterTypeEnum,
  magicalFormulaeCategoryEnum,
  mentorCategoryEnum,
  spellCategoryEnum,
  talentCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { Fragment, useEffect, type ReactElement } from "react";
import { trpc } from "../../../utils/trpc.js";
import Dropdown from "react-dropdown";
import {
  type CustomSpiritsType,
  type DepthTalentInfoType,
  type FormulaListSelectedType,
  type MagicTalentInfoType,
  type ResonanceTalentInfoType,
  type TalentInfoType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import type { MentorType } from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";
import type { CharacterCreatorBonusListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";

interface IProps {
  talent: TalentPriorityType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
  talentInfo: TalentInfoType;
  karmaPoints: number;
  essencePoints: number;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

export const TalentSelect = function (props: IProps) {
  const talent = props.talent;
  let selectTradition;
  let selectMentorSpirit;
  let selectSpells;
  let selectComplexForms;
  let selectParagon;
  let selectAdeptPowers;
  let selectPrograms;

  useEffect(() => {
    switch (talent.category) {
      case talentCategoryEnum.Magic:
        if (props.talentInfo.type !== talentCategoryEnum.Magic) {
          const formulae: FormulaListSelectedType =
            talent.formulae !== undefined
              ? {
                  selectFormulae: true as const,
                  spells: [],
                  rituals: [],
                  alchemicalPreparations: [],
                }
              : {
                  selectFormulae: false as const,
                };
          const powers =
            talent.name === "Adept" || talent.name === "Mystic Adept"
              ? {
                  selectAdeptPowers: true as const,
                  adeptPowers: [],
                }
              : {
                  selectAdeptPowers: false as const,
                };
          props.setTalentInfo({
            type: talentCategoryEnum.Magic,
            selectedTradition: {
              name: "",
              customSpirits: {
                customSpirits: false,
              },
            },
            selectedFormulae: formulae,
            selectedAdeptPowers: powers,
          });
        }
        break;
      case talentCategoryEnum.Resonance:
        if (props.talentInfo.type !== talentCategoryEnum.Resonance) {
          props.setTalentInfo({
            type: talentCategoryEnum.Resonance,
            complexForms: [],
          });
        }
        break;
      case talentCategoryEnum.Depth:
        if (props.talentInfo.type !== talentCategoryEnum.Depth) {
          props.setTalentInfo({
            type: talentCategoryEnum.Depth,
            programs: [],
          });
        }
        break;
      case talentCategoryEnum.Mundane:
        if (props.talentInfo.type !== talentCategoryEnum.Mundane) {
          props.setTalentInfo({
            type: talentCategoryEnum.Mundane,
          });
        }
        break;
    }
  }, []);

  switch (talent.category) {
    // TODO: run setTalentInfo on each change (also later
    // ensure we don't submit the entire character
    // without certain fields set e.g. tradition must be set here)
    case talentCategoryEnum.Magic:
      if (props.talentInfo.type !== talentCategoryEnum.Magic) {
        return <>Loading Magic Talent Info</>;
      }
      selectTradition = (
        <TraditionSelect
          setTalentInfo={props.setTalentInfo}
          talentInfo={props.talentInfo}
        />
      );

      if (
        props.bonusInfo.findIndex((element) => element.linkMentorSpirit) > -1
      ) {
        selectMentorSpirit = (
          <MentorSpiritSelect
            talentInfo={props.talentInfo}
            setTalentInfo={props.setTalentInfo}
          />
        );
      }

      if (
        isFormulaTalentType(props.talentInfo) &&
        talent.formulae !== undefined &&
        talent.formulae > 0
      ) {
        selectSpells = (
          <FormulaSelect
            formulaCount={talent.formulae}
            talentInfo={props.talentInfo}
            setTalentInfo={props.setTalentInfo}
          />
        );
      }
      if (talent.name === "Adept" || talent.name === "Mystic Adept") {
        const talentInfo = props.talentInfo as AdeptTalentType;
        selectAdeptPowers = (
          <AdeptPowerSelect
            magicRating={talent.magic}
            isMysticAdept={talent.name === "Mystic Adept"}
            karmaRemaining={props.karmaPoints}
            talentInfo={talentInfo}
            setTalentInfo={props.setTalentInfo}
          />
        );
      }
      break;
    case talentCategoryEnum.Resonance:
      if (props.talentInfo.type !== talentCategoryEnum.Resonance) {
        return <>Loading Resonance Talent Info</>;
      }
      if (talent.complexForms > 0) {
        selectComplexForms = (
          <ComplexFormSelect
            complexFormCount={talent.complexForms}
            talentInfo={props.talentInfo}
            setTalentInfo={props.setTalentInfo}
          />
        );
      }
      if (props.bonusInfo.findIndex((element) => element.linkParagon) > -1) {
        selectParagon = (
          <ParagonSelect
            talentInfo={props.talentInfo}
            setTalentInfo={props.setTalentInfo}
          />
        );
      }
      break;
    case talentCategoryEnum.Depth:
      if (props.talentInfo.type !== talentCategoryEnum.Depth) {
        return <>Loading Depth Talent Info</>;
      }
      if (talent.depth > 0) {
        selectPrograms = (
          <ProgramSelect
            depth={talent.depth}
            essencePoints={props.essencePoints}
            talentInfo={props.talentInfo}
            setTalentInfo={props.setTalentInfo}
          />
        );
      }
      break;
    case talentCategoryEnum.Mundane:
      break;
  }
  return (
    <Fragment>
      {selectTradition}
      {selectMentorSpirit}
      {selectSpells}
      {selectComplexForms}
      {selectParagon}
      {selectAdeptPowers}
      {selectPrograms}
    </Fragment>
  );
};

const isFormulaTalentType = function (
  talentInfo: MagicTalentInfoType
): talentInfo is FormulaTalentType {
  return talentInfo.selectedFormulae.selectFormulae;
};

interface ITraditionSelectProps {
  talentInfo: MagicTalentInfoType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const TraditionSelect = function (props: ITraditionSelectProps) {
  const traditionList = trpc.character.traditions.useQuery();

  if (traditionList.isError) {
    return <>{traditionList.error.message}</>;
  }

  if (traditionList.data === undefined) {
    return <></>;
  }

  const traditionLoaded = traditionList.data.find((tradition) => {
    return tradition.name === props.talentInfo.selectedTradition.name;
  });

  let spiritSelect;
  if (
    traditionLoaded !== undefined &&
    traditionLoaded.spiritTypes == "Select Spirits"
  ) {
    console.log(props.talentInfo.selectedTradition.customSpirits.customSpirits);
    if (
      props.talentInfo.selectedTradition.customSpirits.customSpirits === true
    ) {
      // Have to use a type assert because typescript gets
      // confused by the nested discriminator
      const talentInfo: CustomSpiritTalentType =
        props.talentInfo as CustomSpiritTalentType;

      spiritSelect = (
        <SpiritSelect
          talentInfo={talentInfo}
          setTalentInfo={props.setTalentInfo}
        />
      );
    }
  }

  return (
    <Fragment>
      <div>
        Tradition:
        {/* TODO: if all or custom enable some selectors */}
        <Dropdown
          options={traditionList.data.map((tradition) => {
            return tradition.name;
          })}
          value={props.talentInfo.selectedTradition.name}
          onChange={(arg) => {
            const newTraditionLoaded = traditionList.data.find((tradition) => {
              return tradition.name === arg.value;
            });
            const customSpirits =
              newTraditionLoaded?.spiritTypes === "Select Spirits"
                ? {
                    customSpirits: true as const,
                    selectedSpiritTypes: {
                      combat: "",
                      detection: "",
                      health: "",
                      illusion: "",
                      manipulation: "",
                    },
                  }
                : {
                    customSpirits: false as const,
                  };
            props.setTalentInfo({
              ...props.talentInfo,
              selectedTradition: {
                name: arg.value,
                customSpirits: customSpirits,
              },
            });
          }}
        />
        {spiritSelect}
      </div>
    </Fragment>
  );
};

type CustomSpiritTalentType = TalentInfoType & {
  type: talentCategoryEnum.Magic;
  selectedTradition: {
    customSpirits: CustomSpiritsType & {
      customSpirits: true;
    };
  };
};
interface ISpiritSelectProps {
  talentInfo: CustomSpiritTalentType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const SpiritSelect = function (props: ISpiritSelectProps) {
  const critterList = trpc.character.critters.useQuery();
  const customSpirits = props.talentInfo.selectedTradition.customSpirits;

  if (critterList.isError) {
    return <>{critterList.error}</>;
  }

  if (critterList.data === undefined) {
    return <></>;
  }
  const spirits = critterList.data.filter(
    (critter) => critter.category === critterTypeEnum.Spirits
  );

  const setSpirit = function (customSpirits: CustomSpiritsType) {
    props.setTalentInfo({
      ...props.talentInfo,
      selectedTradition: {
        name: props.talentInfo.selectedTradition.name,
        customSpirits: customSpirits,
      },
    });
  };

  return (
    <Fragment>
      <div>Combat</div>
      <Dropdown
        options={spirits.map((spirit) => spirit.name)}
        value={customSpirits.selectedSpiritTypes.combat}
        onChange={(arg) => {
          const newSpirit = customSpirits;
          newSpirit.selectedSpiritTypes.combat = arg.value;
          setSpirit(newSpirit);
        }}
      />
      <div>Detection</div>
      <Dropdown
        options={spirits.map((spirit) => spirit.name)}
        value={customSpirits.selectedSpiritTypes.detection}
        onChange={(arg) => {
          const newSpirit = customSpirits;
          newSpirit.selectedSpiritTypes.detection = arg.value;
          setSpirit(newSpirit);
        }}
      />
      <div>Health</div>
      <Dropdown
        options={spirits.map((spirit) => spirit.name)}
        value={customSpirits.selectedSpiritTypes.health}
        onChange={(arg) => {
          const newSpirit = customSpirits;
          newSpirit.selectedSpiritTypes.health = arg.value;
          setSpirit(newSpirit);
        }}
      />
      <div>Illusion</div>
      <Dropdown
        options={spirits.map((spirit) => spirit.name)}
        value={customSpirits.selectedSpiritTypes.illusion}
        onChange={(arg) => {
          const newSpirit = customSpirits;
          newSpirit.selectedSpiritTypes.illusion = arg.value;
          setSpirit(newSpirit);
        }}
      />
      <div>Manipulation</div>
      <Dropdown
        options={spirits.map((spirit) => spirit.name)}
        value={customSpirits.selectedSpiritTypes.manipulation}
        onChange={(arg) => {
          const newSpirit = customSpirits;
          newSpirit.selectedSpiritTypes.manipulation = arg.value;
          setSpirit(newSpirit);
        }}
      />
    </Fragment>
  );
};

interface IMentorSpiritProps {
  talentInfo: TalentInfoType & {
    type: talentCategoryEnum.Magic;
  };
  setTalentInfo: (
    talentInfo: TalentInfoType & {
      type: talentCategoryEnum.Magic;
    }
  ) => void;
}
const MentorSpiritSelect = function (props: IMentorSpiritProps) {
  const mentorList = trpc.character.mentors.useQuery();
  if (mentorList.isError) {
    return <>{mentorList.error}</>;
  }

  if (mentorList.data === undefined) {
    return <></>;
  }

  const selectedMentorSpirit = props.talentInfo.selectedMentor;
  let selectedSourceMentorSpirit:
    | (MentorType & { category: mentorCategoryEnum.MentorSpirit })
    | undefined;
  const choiceSelections: Array<ReactElement> = [];
  if (selectedMentorSpirit !== undefined) {
    selectedSourceMentorSpirit = mentorList.data
      .filter((element) => element.category === mentorCategoryEnum.MentorSpirit)
      .find((element) => element.name === selectedMentorSpirit.name);
    if (selectedSourceMentorSpirit === undefined) {
      throw new Error(`Mentor not found ${selectedMentorSpirit.name}`);
    }
    for (let i = 0; i < selectedSourceMentorSpirit.choiceCount; i++) {
      const displayValue =
        selectedMentorSpirit.choices[i] !== undefined
          ? selectedMentorSpirit.choices[i].name
          : "Select a bonus";
      choiceSelections.push(
        <Dropdown
          options={selectedSourceMentorSpirit.choices
            .filter((element) => {
              return element.set === i + 1;
            })
            .map((element) => element.name)}
          value={displayValue}
          onChange={(arg) => {
            if (selectedSourceMentorSpirit === undefined) {
              // TODO: better way to handle?
              return;
            }
            const newChoice = selectedSourceMentorSpirit.choices.find(
              (element) => element.name === arg.value
            );
            if (newChoice === undefined) {
              throw new Error(`New Choice ${arg.value} doesn't exist`);
            }
            if (selectedMentorSpirit.choices[i] === undefined) {
              selectedMentorSpirit.choices.push(newChoice);
            } else {
              selectedMentorSpirit.choices[i] = newChoice;
            }

            props.setTalentInfo({
              ...props.talentInfo,
              selectedMentor: selectedMentorSpirit,
            });
          }}
        />
      );
    }
  }

  return (
    <Fragment>
      <div>Mentor Spirit:</div>
      <Dropdown
        options={mentorList.data
          .filter(
            (element) => element.category === mentorCategoryEnum.MentorSpirit
          )
          .map((mentor) => {
            return mentor.name;
          })}
        value={selectedMentorSpirit?.name || "Select Mentor"}
        onChange={(arg) => {
          const mentorSpirit = mentorList.data
            .filter(
              (element) => element.category === mentorCategoryEnum.MentorSpirit
            )
            .find((element) => element.name === arg.value);
          if (mentorSpirit === undefined) {
            throw new Error(`Mentor Spirit ${arg.value} doesn't exist`);
          }
          const newMentorSpirit = {
            ...mentorSpirit,
            choices: [],
          };
          if (selectedMentorSpirit !== undefined) {
            console.log(`TODO: remove ${selectedMentorSpirit?.name} bonus`);
          }
          props.setTalentInfo({
            ...props.talentInfo,
            selectedMentor: newMentorSpirit,
          });
        }}
      />
      {choiceSelections}
    </Fragment>
  );
};

type FormulaTalentType = TalentInfoType & {
  type: talentCategoryEnum.Magic;
  selectedFormulae: {
    selectFormulae: true;
  };
};
interface IFormulaProps {
  formulaCount: number;
  talentInfo: FormulaTalentType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const FormulaSelect = function (props: IFormulaProps) {
  const spellList = trpc.character.spells.useQuery();

  if (spellList.isError) {
    return <>{spellList.error}</>;
  }

  if (spellList.data === undefined) {
    return <></>;
  }

  const setFormulae = function (
    formulae: Array<string>,
    formulaCategory: magicalFormulaeCategoryEnum
  ) {
    let specificFormula;
    switch (formulaCategory) {
      case magicalFormulaeCategoryEnum.AlchemicalPreparation:
        specificFormula = {
          alchemicalPreparations: formulae,
        };
        break;
      case magicalFormulaeCategoryEnum.Ritual:
        specificFormula = {
          rituals: formulae,
        };
        break;
      case magicalFormulaeCategoryEnum.Spell:
        specificFormula = {
          spells: formulae,
        };
        break;
    }

    const selectedFormulae = {
      ...props.talentInfo.selectedFormulae,
      ...specificFormula,
    };
    props.setTalentInfo({
      ...props.talentInfo,
      selectedFormulae: selectedFormulae,
    });
  };

  const selectedSpellList = props.talentInfo.selectedFormulae.spells;
  const selectedRitualList = props.talentInfo.selectedFormulae.rituals;
  const selectedAlchemicalPreparationList =
    props.talentInfo.selectedFormulae.alchemicalPreparations;
  const spellDropdowns: Array<ReactElement> = [];
  const ritualDropdowns: Array<ReactElement> = [];
  const alchemicalPreparationDropdowns: Array<ReactElement> = [];
  selectedSpellList.forEach((selectedSpell, index) => {
    spellDropdowns.push(
      <Dropdown
        options={spellList.data
          .filter((spell) => {
            return spell.category !== spellCategoryEnum.Ritual;
          })
          .map((spell) => {
            return spell.name;
          })}
        value={selectedSpell}
        onChange={(arg) => {
          selectedSpellList[index] = arg.value;
          setFormulae(selectedSpellList, magicalFormulaeCategoryEnum.Spell);
        }}
      />
    );
  });
  selectedRitualList.forEach((selectedRitual, index) => {
    ritualDropdowns.push(
      <Dropdown
        options={spellList.data
          .filter((spell) => {
            return spell.category === spellCategoryEnum.Ritual;
          })
          .map((spell) => {
            return spell.name;
          })}
        value={selectedRitual}
        onChange={(arg) => {
          selectedRitualList[index] = arg.value;
          setFormulae(selectedRitualList, magicalFormulaeCategoryEnum.Ritual);
        }}
      />
    );
  });
  selectedAlchemicalPreparationList.forEach(
    (selectedAlchemicalPreparation, index) => {
      alchemicalPreparationDropdowns.push(
        <Dropdown
          options={spellList.data
            .filter((spell) => {
              return spell.category !== spellCategoryEnum.Ritual;
            })
            .map((spell) => {
              return spell.name;
            })}
          value={selectedAlchemicalPreparation}
          onChange={(arg) => {
            selectedAlchemicalPreparationList[index] = arg.value;
            setFormulae(
              selectedAlchemicalPreparationList,
              magicalFormulaeCategoryEnum.AlchemicalPreparation
            );
          }}
        />
      );
    }
  );

  return (
    <Fragment>
      <div>
        Selection Count: {props.formulaCount}
        (each category can separately select this number of items)
      </div>
      <div>Spells:</div>
      <Dropdown
        options={spellList.data
          .filter((spell) => {
            return spell.category !== spellCategoryEnum.Ritual;
          })
          .map((spell) => {
            return spell.name;
          })}
        value={""}
        onChange={(arg) => {
          selectedSpellList.push(arg.value);
          setFormulae(selectedSpellList, magicalFormulaeCategoryEnum.Spell);
        }}
      />
      {spellDropdowns}
      <div>
        Rituals:
        <Dropdown
          options={spellList.data
            .filter((spell) => {
              return spell.category === spellCategoryEnum.Ritual;
            })
            .map((spell) => {
              return spell.name;
            })}
          value={""}
          onChange={(arg) => {
            selectedRitualList.push(arg.value);
            setFormulae(selectedRitualList, magicalFormulaeCategoryEnum.Ritual);
          }}
        />
        {ritualDropdowns}
      </div>
      <div>
        Alchemical formulas:
        <Dropdown
          options={spellList.data
            .filter((spell) => {
              return spell.category !== spellCategoryEnum.Ritual;
            })
            .map((spell) => {
              return spell.name;
            })}
          value={""}
          onChange={(arg) => {
            selectedAlchemicalPreparationList.push(arg.value);
            setFormulae(
              selectedAlchemicalPreparationList,
              magicalFormulaeCategoryEnum.AlchemicalPreparation
            );
          }}
        />
        {alchemicalPreparationDropdowns}
      </div>
    </Fragment>
  );
};

interface IComplexFormProps {
  complexFormCount: number;
  talentInfo: ResonanceTalentInfoType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const ComplexFormSelect = function (props: IComplexFormProps) {
  const complexFormList = trpc.character.complexForms.useQuery();

  if (complexFormList.isError) {
    return <>{complexFormList.error}</>;
  }

  if (complexFormList.data === undefined) {
    return <></>;
  }

  const selectedComplexFormList = props.talentInfo.complexForms;
  const complexFormDropdowns: Array<ReactElement> = [];
  selectedComplexFormList.forEach((selectedComplexForm, index) => {
    complexFormDropdowns.push(
      <Dropdown
        options={complexFormList.data.map((complexForm) => {
          return complexForm.name;
        })}
        value={selectedComplexForm}
        onChange={(arg) => {
          selectedComplexFormList[index] = arg.value;
          props.setTalentInfo({
            ...props.talentInfo,
            complexForms: selectedComplexFormList,
          });
        }}
      />
    );
  });

  return (
    <Fragment>
      <div>Selection Count: {props.complexFormCount}</div>
      <div>
        Complex Forms:
        <Dropdown
          options={complexFormList.data.map((complexForm) => {
            return complexForm.name;
          })}
          onChange={(arg) => {
            selectedComplexFormList.push(arg.value);
            props.setTalentInfo({
              ...props.talentInfo,
              complexForms: selectedComplexFormList,
            });
          }}
        />
        {complexFormDropdowns}
      </div>
    </Fragment>
  );
};

interface IParagonProps {
  talentInfo: TalentInfoType & {
    type: talentCategoryEnum.Resonance;
  };
  setTalentInfo: (
    talentInfo: TalentInfoType & {
      type: talentCategoryEnum.Resonance;
    }
  ) => void;
}
const ParagonSelect = function (props: IParagonProps) {
  const mentorList = trpc.character.mentors.useQuery();
  if (mentorList.isError) {
    return <>{mentorList.error}</>;
  }

  if (mentorList.data === undefined) {
    return <>Loading...</>;
  }

  const selectedParagon = props.talentInfo.selectedMentor;

  return (
    <Fragment>
      <div>Paragon:</div>
      <Dropdown
        options={mentorList.data
          .filter((element) => element.category === mentorCategoryEnum.Paragon)
          .map((mentor) => {
            return mentor.name;
          })}
        value={selectedParagon?.name || "Select Mentor"}
        onChange={(arg) => {
          const paragon = mentorList.data
            .filter(
              (element) => element.category === mentorCategoryEnum.Paragon
            )
            .find((element) => element.name === arg.value);
          if (paragon === undefined) {
            throw new Error(`Paragon ${arg.value} doesn't exist`);
          }
          props.setTalentInfo({
            ...props.talentInfo,
            selectedMentor: paragon,
          });
        }}
      />
    </Fragment>
  );
};

type AdeptTalentType = TalentInfoType & {
  type: talentCategoryEnum.Magic;
  selectedAdeptPowers: {
    selectAdeptPowers: true;
  };
};
interface IAdeptPowerProps {
  magicRating: number;
  isMysticAdept: boolean;
  karmaRemaining: number;
  talentInfo: AdeptTalentType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const AdeptPowerSelect = function (props: IAdeptPowerProps) {
  const adeptPowerList = trpc.character.adeptPowers.useQuery();
  const powerPoints = [];
  for (let power = 0; power <= props.magicRating; power++) {
    powerPoints.push(power.toString());
  }

  if (adeptPowerList.isError) {
    return <>{adeptPowerList.error}</>;
  }

  if (adeptPowerList.data === undefined) {
    return <></>;
  }

  const selectedAdeptPowerList =
    props.talentInfo.selectedAdeptPowers.adeptPowers;
  const adeptPowerDropdowns: Array<ReactElement> = [];
  selectedAdeptPowerList.forEach((selectedAdeptPower, index) => {
    adeptPowerDropdowns.push(
      <Dropdown
        options={adeptPowerList.data.map((adeptPower) => {
          return adeptPower.name;
        })}
        value={selectedAdeptPower}
        onChange={(arg) => {
          selectedAdeptPowerList[index] = arg.value;
          props.setTalentInfo({
            ...props.talentInfo,
            selectedAdeptPowers: {
              selectAdeptPowers: true as const,
              adeptPowers: selectedAdeptPowerList,
            },
          });
        }}
      />
    );
  });
  return (
    <Fragment>
      {props.isMysticAdept ? (
        <div>
          Power Points
          <Dropdown options={powerPoints} />
        </div>
      ) : (
        <div>Power Points: {props.magicRating}</div>
      )}

      <div>
        Adept Powers:
        <Dropdown
          options={adeptPowerList.data.map((adeptPower) => {
            return adeptPower.name;
          })}
          onChange={(arg) => {
            selectedAdeptPowerList.push(arg.value);
            props.setTalentInfo({
              ...props.talentInfo,
              selectedAdeptPowers: {
                selectAdeptPowers: true as const,
                adeptPowers: selectedAdeptPowerList,
              },
            });
          }}
        />
        {adeptPowerDropdowns}
      </div>
    </Fragment>
  );
};

interface IProgramProps {
  essencePoints: number;
  depth: number;
  talentInfo: DepthTalentInfoType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const ProgramSelect = function (props: IProgramProps) {
  const programList = trpc.character.programs.useQuery();

  if (programList.isError) {
    return <>{programList.error}</>;
  }

  if (programList.data === undefined) {
    return <></>;
  }
  const selectedProgramList = props.talentInfo.programs;
  const programDropdowns: Array<ReactElement> = [];
  selectedProgramList.forEach((selectedProgram, index) => {
    programDropdowns.push(
      <Dropdown
        options={programList.data.map((program) => {
          return program.name;
        })}
        value={selectedProgram.name}
        onChange={(arg) => {
          selectedProgramList[index] = { name: arg.value };
          props.setTalentInfo({
            ...props.talentInfo,
            programs: selectedProgramList,
          });
        }}
      />
    );
  });
  return (
    <Fragment>
      <div>Programs: {props.essencePoints + props.depth}</div>

      <div>
        Programs:
        <Dropdown
          options={programList.data.map((program) => {
            return program.name;
          })}
          onChange={(arg) => {
            selectedProgramList.push({ name: arg.value });
            props.setTalentInfo({
              ...props.talentInfo,
              programs: selectedProgramList,
            });
          }}
        />
        {programDropdowns}
      </div>
    </Fragment>
  );
};
