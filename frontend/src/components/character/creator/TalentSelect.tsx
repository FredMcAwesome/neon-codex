import type { TalentPriorityType } from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  critterTypeEnum,
  spellCategoryEnum,
  talentCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { Fragment, useState } from "react";
import { trpc } from "../../../utils/trpc.js";
import Dropdown from "react-dropdown";

interface IProps {
  talent: TalentPriorityType;
  karmaPoints: number;
  essencePoints: number;
}

export const TalentSelect = function (props: IProps) {
  return (
    <TalentSelectLoaded
      talent={props.talent}
      karmaPoints={props.karmaPoints}
      essencePoints={props.essencePoints}
    />
  );
};

const TalentSelectLoaded = function (props: IProps) {
  const talent = props.talent;
  let selectTradition;
  let selectSpells;
  let selectComplexForms;
  let selectAdeptPowers;
  let selectPrograms;
  switch (talent.category) {
    case talentCategoryEnum.Magic:
      selectTradition = <TraditionSelect />;
      if (talent.spells !== undefined && talent.spells > 0) {
        selectSpells = <SpellSelect spellCount={talent.spells} />;
      }
      if (talent.name === "Adept" || talent.name === "Mystic Adept") {
        selectAdeptPowers = (
          <AdeptPowerSelect
            magicRating={talent.magic}
            isMysticAdept={talent.name === "Mystic Adept"}
            karmaRemaining={props.karmaPoints}
          />
        );
      }
      break;
    case talentCategoryEnum.Resonance:
      if (talent.complexForms > 0) {
        selectComplexForms = (
          <ComplexFormSelect complexFormCount={talent.complexForms} />
        );
      }
      break;
    case talentCategoryEnum.Depth:
      if (talent.depth > 0) {
        selectPrograms = (
          <ProgramSelect
            depth={talent.depth}
            essencePoints={props.essencePoints}
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
      {selectSpells}
      {selectComplexForms}
      {selectAdeptPowers}
      {selectPrograms}
    </Fragment>
  );
};

const TraditionSelect = function () {
  const traditionList = trpc.character.traditions.useQuery();
  const [selectedTradition, setSelectedTradition] = useState("");

  if (traditionList.isError) {
    return <>{traditionList.error}</>;
  }

  if (traditionList.data === undefined) {
    return <></>;
  }

  const traditionLoaded = traditionList.data.find((tradition) => {
    return tradition.name === selectedTradition;
  });

  return (
    <Fragment>
      <div>
        Tradition:
        {/* TODO: if all or custom enable some selectors */}
        <Dropdown
          options={traditionList.data.map((tradition) => {
            return tradition.name;
          })}
          value={selectedTradition}
          onChange={(arg) => {
            setSelectedTradition(arg.value);
          }}
        />
        {traditionLoaded !== undefined &&
          traditionLoaded.spiritTypes == "Select Spirits" && <SpiritSelect />}
      </div>
    </Fragment>
  );
};

const SpiritSelect = function () {
  const critterList = trpc.character.critters.useQuery();

  if (critterList.isError) {
    return <>{critterList.error}</>;
  }

  if (critterList.data === undefined) {
    return <></>;
  }
  const spirits = critterList.data.filter(
    (critter) => critter.category === critterTypeEnum.Spirits
  );

  return (
    <Fragment>
      <div>Combat</div>
      <Dropdown options={spirits.map((spirit) => spirit.name)} />
      <div>Detection</div>
      <Dropdown options={spirits.map((spirit) => spirit.name)} />
      <div>Health</div>
      <Dropdown options={spirits.map((spirit) => spirit.name)} />
      <div>Illusion</div>
      <Dropdown options={spirits.map((spirit) => spirit.name)} />
      <div>Manipulation</div>
      <Dropdown options={spirits.map((spirit) => spirit.name)} />
    </Fragment>
  );
};

interface ISpellProps {
  spellCount: number;
}

const SpellSelect = function (props: ISpellProps) {
  const spellsList = trpc.character.spells.useQuery();

  if (spellsList.isError) {
    return <>{spellsList.error}</>;
  }

  if (spellsList.data === undefined) {
    return <></>;
  }

  return (
    <Fragment>
      <div>Selection Count: {props.spellCount}</div>
      <div>
        Spells:
        <Dropdown
          options={spellsList.data
            .filter((spell) => {
              return spell.category !== spellCategoryEnum.Ritual;
            })
            .map((spell) => {
              return spell.name;
            })}
        />
      </div>
      <div>
        Rituals:
        <Dropdown
          options={spellsList.data
            .filter((spell) => {
              return spell.category === spellCategoryEnum.Ritual;
            })
            .map((spell) => {
              return spell.name;
            })}
        />
      </div>
      <div>
        Alchemical formulas:
        <Dropdown
          options={spellsList.data
            .filter((spell) => {
              return spell.category !== spellCategoryEnum.Ritual;
            })
            .map((spell) => {
              return spell.name;
            })}
        />
      </div>
    </Fragment>
  );
};

interface IComplexFormProps {
  complexFormCount: number;
}

const ComplexFormSelect = function (props: IComplexFormProps) {
  const complexFormList = trpc.character.complexForms.useQuery();

  if (complexFormList.isError) {
    return <>{complexFormList.error}</>;
  }

  if (complexFormList.data === undefined) {
    return <></>;
  }

  return (
    <Fragment>
      <div>Selection Count: {props.complexFormCount}</div>
      <div>
        Complex Forms:
        <Dropdown
          options={complexFormList.data.map((complexForm) => {
            return complexForm.name;
          })}
        />
      </div>
    </Fragment>
  );
};

interface IAdeptPowerProps {
  magicRating: number;
  isMysticAdept: boolean;
  karmaRemaining: number;
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
        />
      </div>
    </Fragment>
  );
};

interface IProgramProps {
  essencePoints: number;
  depth: number;
}

const ProgramSelect = function (props: IProgramProps) {
  const programList = trpc.character.adeptPowers.useQuery();

  if (programList.isError) {
    return <>{programList.error}</>;
  }

  if (programList.data === undefined) {
    return <></>;
  }

  return (
    <Fragment>
      <div>Programs: {props.essencePoints + props.depth}</div>

      <div>
        Programs:
        <Dropdown
          options={programList.data.map((adeptPower) => {
            return adeptPower.name;
          })}
        />
      </div>
    </Fragment>
  );
};
