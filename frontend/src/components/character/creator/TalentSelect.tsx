import type { TalentPriorityType } from "@neon-codex/common";
import {
  critterCategoryEnum,
  magicalFormulaeCategoryEnum,
  mentorCategoryEnum,
  spellCategoryEnum,
  talentCategoryEnum,
} from "@neon-codex/common";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useCreatorStaticData } from "../../../hooks/useCreatorStaticData.js";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import {
  type CustomSpiritsType,
  type DepthTalentInfoType,
  type FormulaListSelectedType,
  type MagicTalentInfoType,
  type ResonanceTalentInfoType,
  type TalentInfoType,
} from "@neon-codex/common";
import type { MentorType } from "@neon-codex/common";
import type { CharacterCreatorBonusListType } from "@neon-codex/common";

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

  // Helper for initializing talent info ensuring category matches
  function getInitialTalentInfo(): TalentInfoType {
    if (props.talentInfo.category === talent.category) {
      return props.talentInfo;
    }
    // Mismatch - return default structure
    switch (talent.category) {
      case talentCategoryEnum.Magic: {
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
        return {
          category: talentCategoryEnum.Magic,
          selectedTradition: {
            name: "",
            customSpirits: {
              customSpirits: false,
            },
          },
          selectedFormulae: formulae,
          selectedAdeptPowers: powers,
        };
      }
      case talentCategoryEnum.Resonance:
        return {
          category: talentCategoryEnum.Resonance,
          complexForms: [],
        };
      case talentCategoryEnum.Depth:
        return {
          category: talentCategoryEnum.Depth,
          programs: [],
        };
      case talentCategoryEnum.Mundane:
        return {
          category: talentCategoryEnum.Mundane,
        };
    }
  }

  // Local state
  const [localTalentInfo, setLocalTalentInfo] =
    useState<TalentInfoType>(getInitialTalentInfo);

  // Refs for cleanup
  const talentInfoRef = useRef(localTalentInfo);

  useEffect(() => {
    talentInfoRef.current = localTalentInfo;
  }, [localTalentInfo]);

  // Sync to parent on unmount
  useEffect(() => {
    return () => {
      props.setTalentInfo(talentInfoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (talent.category) {
    // TODO: run setTalentInfo on each change (also later
    // ensure we don't submit the entire character
    // without certain fields set e.g. tradition must be set here)
    case talentCategoryEnum.Magic:
      if (localTalentInfo.category !== talentCategoryEnum.Magic) {
        return <>Loading Magic Talent Info</>;
      }
      selectTradition = (
        <TraditionSelect
          setTalentInfo={setLocalTalentInfo}
          talentInfo={localTalentInfo}
        />
      );

      if (
        props.bonusInfo.findIndex((element) => element.linkMentorSpirit) > -1
      ) {
        selectMentorSpirit = (
          <MentorSpiritSelect
            talentInfo={localTalentInfo}
            setTalentInfo={setLocalTalentInfo}
          />
        );
      }

      if (
        isFormulaTalentType(localTalentInfo) &&
        talent.formulae !== undefined &&
        talent.formulae > 0
      ) {
        selectSpells = (
          <FormulaSelect
            formulaCount={talent.formulae}
            talentInfo={localTalentInfo}
            setTalentInfo={setLocalTalentInfo}
          />
        );
      }
      if (talent.name === "Adept" || talent.name === "Mystic Adept") {
        const talentInfo = localTalentInfo as AdeptTalentType;
        selectAdeptPowers = (
          <AdeptPowerSelect
            magicRating={talent.magic}
            isMysticAdept={talent.name === "Mystic Adept"}
            karmaRemaining={props.karmaPoints}
            talentInfo={talentInfo}
            setTalentInfo={setLocalTalentInfo}
          />
        );
      }
      break;
    case talentCategoryEnum.Resonance:
      if (localTalentInfo.category !== talentCategoryEnum.Resonance) {
        return <>Loading Resonance Talent Info</>;
      }
      const resonanceTalentInfo = localTalentInfo as ResonanceTalentInfoType;

      if (talent.complexForms > 0) {
        selectComplexForms = (
          <ComplexFormSelect
            complexFormCount={talent.complexForms}
            talentInfo={resonanceTalentInfo}
            setTalentInfo={setLocalTalentInfo}
          />
        );
      }
      if (props.bonusInfo.findIndex((element) => element.linkParagon) > -1) {
        selectParagon = (
          <ParagonSelect
            talentInfo={resonanceTalentInfo}
            setTalentInfo={setLocalTalentInfo}
          />
        );
      }
      break;
    case talentCategoryEnum.Depth:
      if (localTalentInfo.category !== talentCategoryEnum.Depth) {
        return <>Loading Depth Talent Info</>;
      }
      if (talent.depth > 0) {
        selectPrograms = (
          <ProgramSelect
            depth={talent.depth}
            essencePoints={props.essencePoints}
            talentInfo={localTalentInfo}
            setTalentInfo={setLocalTalentInfo}
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
  const traditionList = useCreatorStaticData("traditions");

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
    <div className="talent-section">
      <div className="talent-section-header">Tradition</div>
      <div className="talent-item">
        <label>Select Tradition</label>
        <ArwesSelect
          value={props.talentInfo.selectedTradition.name}
          onChange={(event) => {
            const arg = { value: event.target.value };
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
        >
          <option value="" disabled>
            Select Tradition
          </option>
          {traditionList.data.map((tradition) => (
            <option key={tradition.name} value={tradition.name}>
              {tradition.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
      {spiritSelect}
    </div>
  );
};

type CustomSpiritTalentType = TalentInfoType & {
  category: talentCategoryEnum.Magic;
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
  const critterList = useCreatorStaticData("critters");
  const customSpirits = props.talentInfo.selectedTradition.customSpirits;

  if (critterList.isError) {
    return <>{critterList.error.message}</>;
  }

  if (critterList.data === undefined) {
    return <></>;
  }
  const spirits = critterList.data.filter(
    (critter) => critter.category === critterCategoryEnum.Spirits
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
    <div className="talent-grid" style={{ marginTop: "15px" }}>
      <div className="talent-item">
        <label>Combat</label>
        <ArwesSelect
          value={customSpirits.selectedSpiritTypes.combat}
          onChange={(event) => {
            const arg = { value: event.target.value };
            const newSpirit = customSpirits;
            newSpirit.selectedSpiritTypes.combat = arg.value;
            setSpirit(newSpirit);
          }}
        >
          <option value="" disabled>
            Select Spirit
          </option>
          {spirits.map((spirit) => (
            <option key={spirit.name} value={spirit.name}>
              {spirit.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
      <div className="talent-item">
        <label>Detection</label>
        <ArwesSelect
          value={customSpirits.selectedSpiritTypes.detection}
          onChange={(event) => {
            const arg = { value: event.target.value };
            const newSpirit = customSpirits;
            newSpirit.selectedSpiritTypes.detection = arg.value;
            setSpirit(newSpirit);
          }}
        >
          <option value="" disabled>
            Select Spirit
          </option>
          {spirits.map((spirit) => (
            <option key={spirit.name} value={spirit.name}>
              {spirit.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
      <div className="talent-item">
        <label>Health</label>
        <ArwesSelect
          value={customSpirits.selectedSpiritTypes.health}
          onChange={(event) => {
            const arg = { value: event.target.value };
            const newSpirit = customSpirits;
            newSpirit.selectedSpiritTypes.health = arg.value;
            setSpirit(newSpirit);
          }}
        >
          <option value="" disabled>
            Select Spirit
          </option>
          {spirits.map((spirit) => (
            <option key={spirit.name} value={spirit.name}>
              {spirit.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
      <div className="talent-item">
        <label>Illusion</label>
        <ArwesSelect
          value={customSpirits.selectedSpiritTypes.illusion}
          onChange={(event) => {
            const arg = { value: event.target.value };
            const newSpirit = customSpirits;
            newSpirit.selectedSpiritTypes.illusion = arg.value;
            setSpirit(newSpirit);
          }}
        >
          <option value="" disabled>
            Select Spirit
          </option>
          {spirits.map((spirit) => (
            <option key={spirit.name} value={spirit.name}>
              {spirit.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
      <div className="talent-item">
        <label>Manipulation</label>
        <ArwesSelect
          value={customSpirits.selectedSpiritTypes.manipulation}
          onChange={(event) => {
            const arg = { value: event.target.value };
            const newSpirit = customSpirits;
            newSpirit.selectedSpiritTypes.manipulation = arg.value;
            setSpirit(newSpirit);
          }}
        >
          <option value="" disabled>
            Select Spirit
          </option>
          {spirits.map((spirit) => (
            <option key={spirit.name} value={spirit.name}>
              {spirit.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
    </div>
  );
};

interface IMentorSpiritProps {
  talentInfo: TalentInfoType & {
    category: talentCategoryEnum.Magic;
  };
  setTalentInfo: (
    talentInfo: TalentInfoType & {
      category: talentCategoryEnum.Magic;
    }
  ) => void;
}
const MentorSpiritSelect = function (props: IMentorSpiritProps) {
  const mentorList = useCreatorStaticData("mentors");
  if (mentorList.isError) {
    return <>{mentorList.error.message}</>;
  }

  if (mentorList.data === undefined) {
    return <></>;
  }

  const selectedMentorSpirit = props.talentInfo.selectedMentor;
  let selectedSourceMentorSpirit:
    (MentorType & { category: mentorCategoryEnum.MentorSpirit }) | undefined;
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
        <div key={i} className="talent-item" style={{ marginTop: "10px" }}>
          <label>Choice {i + 1}</label>
          <ArwesSelect
            value={displayValue}
            onChange={(event) => {
              const arg = { value: event.target.value };
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
          >
            <option value="Select a bonus" disabled>
              Select a bonus
            </option>
            {selectedSourceMentorSpirit.choices
              .filter((element) => {
                return element.set === i + 1;
              })
              .map((element) => (
                <option key={element.name} value={element.name}>
                  {element.name}
                </option>
              ))}
          </ArwesSelect>
        </div>
      );
    }
  }

  return (
    <div className="talent-section">
      <div className="talent-section-header">Mentor Spirit</div>
      <div className="talent-item">
        <label>Select Mentor Spirit</label>
        <ArwesSelect
          value={selectedMentorSpirit?.name || "Select Mentor"}
          onChange={(event) => {
            const arg = { value: event.target.value };
            const mentorSpirit = mentorList.data
              .filter(
                (element) =>
                  element.category === mentorCategoryEnum.MentorSpirit
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
        >
          <option value="Select Mentor" disabled>
            Select Mentor
          </option>
          {mentorList.data
            .filter(
              (element) => element.category === mentorCategoryEnum.MentorSpirit
            )
            .map((mentor) => (
              <option key={mentor.name} value={mentor.name}>
                {mentor.name}
              </option>
            ))}
        </ArwesSelect>
      </div>
      {choiceSelections}
    </div>
  );
};

type FormulaTalentType = TalentInfoType & {
  category: talentCategoryEnum.Magic;
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
  const spellList = useCreatorStaticData("spells");

  if (spellList.isError) {
    return <>{spellList.error.message}</>;
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
      <div key={index} style={{ marginTop: "5px" }}>
        <ArwesSelect
          value={selectedSpell}
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedSpellList[index] = arg.value;
            setFormulae(selectedSpellList, magicalFormulaeCategoryEnum.Spell);
          }}
        >
          {spellList.data
            .filter((spell) => {
              return spell.category !== spellCategoryEnum.Ritual;
            })
            .map((spell) => (
              <option key={spell.name} value={spell.name}>
                {spell.name}
              </option>
            ))}
        </ArwesSelect>
      </div>
    );
  });
  selectedRitualList.forEach((selectedRitual, index) => {
    ritualDropdowns.push(
      <div key={index} style={{ marginTop: "5px" }}>
        <ArwesSelect
          value={selectedRitual}
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedRitualList[index] = arg.value;
            setFormulae(selectedRitualList, magicalFormulaeCategoryEnum.Ritual);
          }}
        >
          {spellList.data
            .filter((spell) => {
              return spell.category === spellCategoryEnum.Ritual;
            })
            .map((spell) => (
              <option key={spell.name} value={spell.name}>
                {spell.name}
              </option>
            ))}
        </ArwesSelect>
      </div>
    );
  });
  selectedAlchemicalPreparationList.forEach(
    (selectedAlchemicalPreparation, index) => {
      alchemicalPreparationDropdowns.push(
        <div key={index} style={{ marginTop: "5px" }}>
          <ArwesSelect
            value={selectedAlchemicalPreparation}
            onChange={(event) => {
              const arg = { value: event.target.value };
              selectedAlchemicalPreparationList[index] = arg.value;
              setFormulae(
                selectedAlchemicalPreparationList,
                magicalFormulaeCategoryEnum.AlchemicalPreparation
              );
            }}
          >
            {spellList.data
              .filter((spell) => {
                return spell.category !== spellCategoryEnum.Ritual;
              })
              .map((spell) => (
                <option key={spell.name} value={spell.name}>
                  {spell.name}
                </option>
              ))}
          </ArwesSelect>
        </div>
      );
    }
  );

  return (
    <div className="talent-section">
      <div className="talent-section-header">
        Selection Count: {props.formulaCount}
        <span style={{ fontSize: "0.8em", marginLeft: "10px", opacity: 0.8 }}>
          (each category can separately select this number of items)
        </span>
      </div>

      <div className="talent-grid">
        <div className="talent-item">
          <label>Spells</label>
          <ArwesSelect
            value={""}
            onChange={(event) => {
              const arg = { value: event.target.value };
              selectedSpellList.push(arg.value);
              setFormulae(selectedSpellList, magicalFormulaeCategoryEnum.Spell);
            }}
          >
            <option value="" disabled>
              Add Spell
            </option>
            {spellList.data
              .filter((spell) => {
                return spell.category !== spellCategoryEnum.Ritual;
              })
              .map((spell) => (
                <option key={spell.name} value={spell.name}>
                  {spell.name}
                </option>
              ))}
          </ArwesSelect>
          {spellDropdowns}
        </div>

        <div className="talent-item">
          <label>Rituals</label>
          <ArwesSelect
            value={""}
            onChange={(event) => {
              const arg = { value: event.target.value };
              selectedRitualList.push(arg.value);
              setFormulae(
                selectedRitualList,
                magicalFormulaeCategoryEnum.Ritual
              );
            }}
          >
            <option value="" disabled>
              Add Ritual
            </option>
            {spellList.data
              .filter((spell) => {
                return spell.category === spellCategoryEnum.Ritual;
              })
              .map((spell) => (
                <option key={spell.name} value={spell.name}>
                  {spell.name}
                </option>
              ))}
          </ArwesSelect>
          {ritualDropdowns}
        </div>

        <div className="talent-item">
          <label>Alchemical formulas</label>
          <ArwesSelect
            value={""}
            onChange={(event) => {
              const arg = { value: event.target.value };
              selectedAlchemicalPreparationList.push(arg.value);
              setFormulae(
                selectedAlchemicalPreparationList,
                magicalFormulaeCategoryEnum.AlchemicalPreparation
              );
            }}
          >
            <option value="" disabled>
              Add Alchemical Formula
            </option>
            {spellList.data
              .filter((spell) => {
                return spell.category !== spellCategoryEnum.Ritual;
              })
              .map((spell) => (
                <option key={spell.name} value={spell.name}>
                  {spell.name}
                </option>
              ))}
          </ArwesSelect>
          {alchemicalPreparationDropdowns}
        </div>
      </div>
    </div>
  );
};

interface IComplexFormProps {
  complexFormCount: number;
  talentInfo: ResonanceTalentInfoType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const ComplexFormSelect = function (props: IComplexFormProps) {
  const complexFormList = useCreatorStaticData("complexForms");

  if (complexFormList.isError) {
    return <>{complexFormList.error.message}</>;
  }

  if (complexFormList.data === undefined) {
    return <></>;
  }

  const selectedComplexFormList = props.talentInfo.complexForms;
  const complexFormDropdowns: Array<ReactElement> = [];
  selectedComplexFormList.forEach((selectedComplexForm, index) => {
    complexFormDropdowns.push(
      <div key={index} style={{ marginTop: "5px" }}>
        <ArwesSelect
          value={selectedComplexForm}
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedComplexFormList[index] = arg.value;
            props.setTalentInfo({
              ...props.talentInfo,
              complexForms: selectedComplexFormList,
            });
          }}
        >
          {complexFormList.data.map((complexForm) => (
            <option key={complexForm.name} value={complexForm.name}>
              {complexForm.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
    );
  });

  return (
    <div className="talent-section">
      <div className="talent-section-header">
        Complex Forms (Count: {props.complexFormCount})
      </div>
      <div className="talent-item">
        <label>Add Complex Form</label>
        <ArwesSelect
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedComplexFormList.push(arg.value);
            props.setTalentInfo({
              ...props.talentInfo,
              complexForms: selectedComplexFormList,
            });
          }}
        >
          <option value="" disabled selected>
            Select Complex Form
          </option>
          {complexFormList.data.map((complexForm) => (
            <option key={complexForm.name} value={complexForm.name}>
              {complexForm.name}
            </option>
          ))}
        </ArwesSelect>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {complexFormDropdowns}
        </div>
      </div>
    </div>
  );
};

interface IParagonProps {
  talentInfo: TalentInfoType & {
    category: talentCategoryEnum.Resonance;
  };
  setTalentInfo: (
    talentInfo: TalentInfoType & {
      category: talentCategoryEnum.Resonance;
    }
  ) => void;
}
const ParagonSelect = function (props: IParagonProps) {
  const mentorList = useCreatorStaticData("mentors");
  if (mentorList.isError) {
    return <>{mentorList.error.message}</>;
  }

  if (mentorList.data === undefined) {
    return <>Loading...</>;
  }

  const selectedParagon = props.talentInfo.selectedMentor;

  return (
    <div className="talent-section">
      <div className="talent-section-header">Paragon</div>
      <div className="talent-item">
        <label>Select Paragon</label>
        <ArwesSelect
          value={selectedParagon?.name || "Select Mentor"}
          onChange={(event) => {
            const arg = { value: event.target.value };
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
        >
          <option value="Select Mentor" disabled>
            Select Paragon
          </option>
          {mentorList.data
            .filter(
              (element) => element.category === mentorCategoryEnum.Paragon
            )
            .map((mentor) => (
              <option key={mentor.name} value={mentor.name}>
                {mentor.name}
              </option>
            ))}
        </ArwesSelect>
      </div>
    </div>
  );
};

type AdeptTalentType = TalentInfoType & {
  category: talentCategoryEnum.Magic;
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
  const adeptPowerList = useCreatorStaticData("adeptPowers");
  const powerPoints = [];
  for (let power = 0; power <= props.magicRating; power++) {
    powerPoints.push(power.toString());
  }

  if (adeptPowerList.isError) {
    return <>{adeptPowerList.error.message}</>;
  }

  if (adeptPowerList.data === undefined) {
    return <></>;
  }

  const selectedAdeptPowerList =
    props.talentInfo.selectedAdeptPowers.adeptPowers;
  const adeptPowerDropdowns: Array<ReactElement> = [];
  selectedAdeptPowerList.forEach((selectedAdeptPower, index) => {
    adeptPowerDropdowns.push(
      <div key={index} style={{ marginTop: "5px" }}>
        <ArwesSelect
          value={selectedAdeptPower}
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedAdeptPowerList[index] = arg.value;
            props.setTalentInfo({
              ...props.talentInfo,
              selectedAdeptPowers: {
                selectAdeptPowers: true as const,
                adeptPowers: selectedAdeptPowerList,
              },
            });
          }}
        >
          {adeptPowerList.data.map((adeptPower) => (
            <option key={adeptPower.name} value={adeptPower.name}>
              {adeptPower.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
    );
  });
  return (
    <div className="talent-section">
      <div className="talent-section-header">
        {props.isMysticAdept ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Power Points</span>
            <div style={{ width: "100px" }}>
              <ArwesSelect
                onChange={() => {
                  // Handle power points change if needed, though logic seems missing in original
                }}
              >
                {powerPoints.map((point) => (
                  <option key={point} value={point}>
                    {point}
                  </option>
                ))}
              </ArwesSelect>
            </div>
          </div>
        ) : (
          <div>Power Points: {props.magicRating}</div>
        )}
      </div>

      <div className="talent-item">
        <label>Adept Powers</label>
        <ArwesSelect
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedAdeptPowerList.push(arg.value);
            props.setTalentInfo({
              ...props.talentInfo,
              selectedAdeptPowers: {
                selectAdeptPowers: true as const,
                adeptPowers: selectedAdeptPowerList,
              },
            });
          }}
        >
          <option value="" disabled selected>
            Add Adept Power
          </option>
          {adeptPowerList.data.map((adeptPower) => (
            <option key={adeptPower.name} value={adeptPower.name}>
              {adeptPower.name}
            </option>
          ))}
        </ArwesSelect>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {adeptPowerDropdowns}
        </div>
      </div>
    </div>
  );
};

interface IProgramProps {
  essencePoints: number;
  depth: number;
  talentInfo: DepthTalentInfoType;
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const ProgramSelect = function (props: IProgramProps) {
  const programList = useCreatorStaticData("programs");

  if (programList.isError) {
    return <>{programList.error.message}</>;
  }

  if (programList.data === undefined) {
    return <></>;
  }
  const selectedProgramList = props.talentInfo.programs;
  const programDropdowns: Array<ReactElement> = [];
  selectedProgramList.forEach((selectedProgram, index) => {
    programDropdowns.push(
      <div key={index} style={{ marginTop: "5px" }}>
        <ArwesSelect
          value={selectedProgram.name}
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedProgramList[index] = { name: arg.value };
            props.setTalentInfo({
              ...props.talentInfo,
              programs: selectedProgramList,
            });
          }}
        >
          {programList.data.map((program) => (
            <option key={program.name} value={program.name}>
              {program.name}
            </option>
          ))}
        </ArwesSelect>
      </div>
    );
  });
  return (
    <div className="talent-section">
      <div className="talent-section-header">
        Programs (Max: {props.essencePoints + props.depth})
      </div>

      <div className="talent-item">
        <label>Add Program</label>
        <ArwesSelect
          onChange={(event) => {
            const arg = { value: event.target.value };
            selectedProgramList.push({ name: arg.value });
            props.setTalentInfo({
              ...props.talentInfo,
              programs: selectedProgramList,
            });
          }}
        >
          <option value="" disabled selected>
            Select Program
          </option>
          {programList.data.map((program) => (
            <option key={program.name} value={program.name}>
              {program.name}
            </option>
          ))}
        </ArwesSelect>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {programDropdowns}
        </div>
      </div>
    </div>
  );
};
