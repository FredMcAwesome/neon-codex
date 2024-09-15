import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
  PrioritiesEnum,
  type PriorityLevelsType,
  type SpecialAttributesType,
  type HeritagePrioritySelectedType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { trpc } from "../../../utils/trpc.js";
import {
  PriorityLetterOptions,
  type AttributePriorityType,
  type HeritageOptionsPriorityType,
  type PriorityRowType,
  type PriorityTableType,
  type PriorityType,
  type ResourceOptionsPriorityType,
  type SkillPriorityType,
  type TalentOptionsPriorityType,
  type TalentPriorityType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  priorityCategoryEnum,
  priorityLetterEnum,
  priorityTableRunnerLevelEnum,
  talentCategoryEnum,
} from "@neon-codex/common/build/enums.js";

const columnHelper = createColumnHelper<
  PriorityRowType & { resources: { runnerLevel: priorityTableRunnerLevelEnum } }
>();

const columns = [
  columnHelper.accessor("priority", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("heritages", {
    header: "Heritage",
    cell: (info) => {
      return info.getValue().name;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("attributes", {
    header: "Attributes",
    cell: (info) => {
      return info.getValue().name;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("talents", {
    header: "Talent",
    cell: (info) => {
      return info.getValue().name;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("skills", {
    header: "Skills",
    cell: (info) => {
      return info.getValue().name;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("resources", {
    header: "Resources",
    cell: (info) => {
      const resources = info.getValue();
      resources.runnerLevel;
      return (
        resources.runnerLevel === priorityTableRunnerLevelEnum.StreetLevel
          ? resources.streetLevel
          : resources.runnerLevel === priorityTableRunnerLevelEnum.Standard
          ? resources.standard
          : resources.primeRunner
      ).name;
    },
    footer: (info) => info.column.id,
  }),
];

// useReactTable can't use defaultData directly because it is imported...

interface PriorityTableProps {
  priorityTable: PriorityTableType;
  runnerLevel: priorityTableRunnerLevelEnum;
}

const PrioritiesTable = function (props: PriorityTableProps) {
  // useState will ensure we aren't creating new copies of data,
  // we only initialise/create the data array on first mount
  const [data] = useState(
    [
      { priority: priorityLetterEnum.A, ...props.priorityTable.A },
      { priority: priorityLetterEnum.B, ...props.priorityTable.B },
      { priority: priorityLetterEnum.C, ...props.priorityTable.C },
      { priority: priorityLetterEnum.D, ...props.priorityTable.D },
      { priority: priorityLetterEnum.E, ...props.priorityTable.E },
    ].map((row) => {
      return {
        ...row,
        resources: {
          ...row.resources,
          runnerLevel: props.runnerLevel,
        },
      };
    })
  );
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* https://github.com/TanStack/table/issues/4580 */}
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface IProps {
  priorityInfo: PriorityLevelsType;
  setPriorityInfo: (loadingPriorities: PriorityLevelsType) => void;
  priorityHeritage: HeritagePrioritySelectedType;
  setPriorityHeritage: (heritage: HeritagePrioritySelectedType) => void;
  setPriorityAttributes: (attributePoints: number) => void;
  setPriorityTalent: (talent: TalentPriorityType) => void;
  setPrioritySkills: (skills: SkillPriorityType) => void;
  setPriorityResources: (resources: number) => void;
  specialAttributeInfo: SpecialAttributesType;
  setSpecialAttributeInfo: (
    loadingSpecialAttributes: SpecialAttributesType
  ) => void;
  priorityTalent: TalentPriorityType;
}

const PriorityListSelect = function ({
  priorityInfo,
  setPriorityInfo,
  priorityHeritage,
  setPriorityHeritage,
  setPriorityAttributes,
  setPriorityTalent,
  setPrioritySkills,
  setPriorityResources,
  specialAttributeInfo,
  setSpecialAttributeInfo,
  priorityTalent,
}: IProps) {
  const priorityTable = trpc.character.priorities.useQuery();

  if (priorityTable.isError) {
    return <>{priorityTable.error}</>;
  }

  if (priorityTable.data === undefined) {
    return <></>;
  }

  return (
    <PrioritySelectLoaded
      priorityTable={priorityTable.data}
      priorityInfo={priorityInfo}
      setPriorityInfo={setPriorityInfo}
      priorityHeritage={priorityHeritage}
      setPriorityHeritage={setPriorityHeritage}
      setPriorityAttributes={setPriorityAttributes}
      setPriorityTalent={setPriorityTalent}
      setPrioritySkills={setPrioritySkills}
      setPriorityResources={setPriorityResources}
      specialAttributeInfo={specialAttributeInfo}
      setSpecialAttributeInfo={setSpecialAttributeInfo}
      priorityTalent={priorityTalent}
    />
  );
};

export default PriorityListSelect;

const PrioritySelectLoaded = function ({
  priorityTable,
  priorityInfo,
  setPriorityInfo,
  priorityHeritage,
  setPriorityHeritage,
  setPriorityAttributes,
  setPriorityTalent,
  setPrioritySkills,
  setPriorityResources,
  specialAttributeInfo,
  setSpecialAttributeInfo,
  priorityTalent,
}: IProps & { priorityTable: PriorityTableType }) {
  // Todo: add css effect when another option changes so it is obvious which other column was affected
  function changePriorities(
    column: PrioritiesEnum,
    newPriority: priorityLetterEnum
  ) {
    const newPriorities = { ...priorityInfo };
    let changedPriority;
    switch (column) {
      case PrioritiesEnum.Heritage:
        changedPriority = newPriorities.heritage;
        newPriorities.heritage = newPriority;
        break;
      case PrioritiesEnum.Attributes:
        changedPriority = newPriorities.attributes;
        newPriorities.attributes = newPriority;
        break;
      case PrioritiesEnum.Talents:
        changedPriority = newPriorities.talent;
        newPriorities.talent = newPriority;
        break;
      case PrioritiesEnum.Skills:
        changedPriority = newPriorities.skills;
        newPriorities.skills = newPriority;
        break;
      case PrioritiesEnum.Resources:
        changedPriority = newPriorities.resources;
        newPriorities.resources = newPriority;
        break;
    }

    // TODO: only do this if not using sum to ten
    if (priorityInfo.heritage === newPriority) {
      newPriorities.heritage = changedPriority;
    } else if (priorityInfo.attributes === newPriority) {
      newPriorities.attributes = changedPriority;
    } else if (priorityInfo.talent === newPriority) {
      newPriorities.talent = changedPriority;
    } else if (priorityInfo.skills === newPriority) {
      newPriorities.skills = changedPriority;
    } else if (priorityInfo.resources === newPriority) {
      newPriorities.resources = changedPriority;
    }

    setPriorityInfo(newPriorities);
  }

  let metavariantOptions: Array<string> = [];

  const heritages = convertererer(
    priorityTable,
    priorityInfo.heritage,
    priorityCategoryEnum.Heritage
  );
  const heritageOptions = heritages.heritageList.map((heritage) => {
    return heritage.name;
  });
  let heritage = heritages.heritageList.find((heritageLocal) => {
    return (
      heritageLocal.name === priorityHeritage.heritage &&
      heritageLocal.specialAttributePoints ===
        priorityHeritage.specialAttributePoints
    );
  });
  if (heritage !== undefined && heritage.metavariantList !== undefined) {
    metavariantOptions = heritage.metavariantList.map(
      (metavariant) => metavariant.name
    );
  } else {
    metavariantOptions = [];
  }

  const talents = convertererer(
    priorityTable,
    priorityInfo.talent,
    priorityCategoryEnum.Talent
  );
  const talentOptions = talents.talentList.map((talentLocal) => {
    return talentLocal.name;
  });

  useEffect(() => {
    const heritages = convertererer(
      priorityTable,
      priorityInfo.heritage,
      priorityCategoryEnum.Heritage
    );
    let heritage = heritages.heritageList.find((heritageLocal) => {
      return (
        heritageLocal.name === priorityHeritage.heritage &&
        heritageLocal.specialAttributePoints ===
          priorityHeritage.specialAttributePoints
      );
    });
    // On first load or on heritage priority change need to set
    // a default heritage
    if (heritage === undefined) {
      heritage = heritages.heritageList.find((heritageLocal) => {
        return heritageLocal.name === heritageOptions[0];
      });
      if (heritage === undefined) {
        throw Error("Heritage is undefined");
      }
      const newHeritage = {
        heritage: heritage.name,
        specialAttributePoints: heritage.specialAttributePoints,
        metavariant: undefined,
      };
      setPriorityHeritage(newHeritage);
    }

    const talents = convertererer(
      priorityTable,
      priorityInfo.talent,
      priorityCategoryEnum.Talent
    );
    let talent = talents.talentList.find((talentLocal) => {
      return talentLocal.label === priorityTalent.label;
    });
    // On first load or on talent priority change need to set
    // a default talent
    if (talent === undefined) {
      talent = talents.talentList.find((talentLocal) => {
        return talentLocal.name === talentOptions[0];
      });
      if (talent === undefined) {
        throw Error("Talent is undefined");
      }
      setPriorityTalent(talent);
      const specialAttribute = specialAttributeInfo;
      switch (talent.category) {
        case talentCategoryEnum.Magic:
          specialAttribute.talent = {
            type: talentCategoryEnum.Magic,
            magic: talent.magic,
          };
          break;
        case talentCategoryEnum.Depth:
          specialAttribute.talent = {
            type: talentCategoryEnum.Depth,
            depth: talent.depth,
          };
          break;
        case talentCategoryEnum.Resonance:
          specialAttribute.talent = {
            type: talentCategoryEnum.Resonance,
            resonance: talent.resonance,
          };
          break;
        case talentCategoryEnum.Mundane:
          specialAttribute.talent = {
            type: talentCategoryEnum.Mundane,
          };
          break;
      }
      setSpecialAttributeInfo(specialAttribute);
    }
  }, [
    priorityTable,
    priorityInfo,
    setPriorityHeritage,
    priorityHeritage,
    setPriorityTalent,
    priorityTalent,
    heritageOptions,
    talentOptions,
    setSpecialAttributeInfo,
    specialAttributeInfo,
  ]);

  return (
    <Fragment>
      <h1>Priority Selection</h1>
      <PrioritiesTable
        priorityTable={priorityTable}
        runnerLevel={priorityTableRunnerLevelEnum.StreetLevel}
      />
      <div>
        <div>
          <label htmlFor="heritage">Heritage:</label>
          <Dropdown
            options={PriorityLetterOptions}
            value={priorityInfo.heritage}
            onChange={(arg) => {
              changePriorities(
                PrioritiesEnum.Heritage,
                priorityLetterEnum[arg.value as keyof typeof priorityLetterEnum]
              );
            }}
            className="heritagePriority"
          />
          <Dropdown
            options={heritageOptions}
            value={priorityHeritage.heritage}
            onChange={(arg) => {
              const heritages = convertererer(
                priorityTable,
                priorityInfo.heritage,
                priorityCategoryEnum.Heritage
              );
              const baseHeritage = heritages.heritageList.find((heritage) => {
                return heritage.name === arg.value;
              });
              if (baseHeritage === undefined) {
                throw Error("baseHeritage is not defined");
              }
              const newHeritage = priorityHeritage;
              newHeritage.heritage = baseHeritage.name;
              newHeritage.specialAttributePoints =
                baseHeritage.specialAttributePoints;
              newHeritage.metavariant = undefined;
              setPriorityHeritage(newHeritage);
            }}
            placeholder={"Select an option"}
            className="heritageOptions"
          />
          {metavariantOptions.length > 0 && (
            <Dropdown
              options={metavariantOptions}
              value={priorityHeritage.metavariant || ""}
              onChange={(arg) => {
                const heritages = convertererer(
                  priorityTable,
                  priorityInfo.heritage,
                  priorityCategoryEnum.Heritage
                );
                const baseHeritage = heritages.heritageList.find((heritage) => {
                  return heritage.name === priorityHeritage.heritage;
                });
                if (baseHeritage === undefined) {
                  throw Error("baseHeritage is not defined");
                }
                if (baseHeritage.metavariantList === undefined) {
                  throw Error("baseHeritage metavariant list is not defined");
                }
                const metavariant = baseHeritage.metavariantList.find(
                  (metavariant) => {
                    return metavariant.name === arg.value;
                  }
                );
                if (metavariant === undefined) {
                  throw Error("metavariant is not defined");
                }
                const newHeritage = priorityHeritage;
                newHeritage.metavariant = metavariant.name;
                newHeritage.specialAttributePoints =
                  metavariant.specialAttributePoints;
                setPriorityHeritage(newHeritage);
              }}
              placeholder={"Select an option"}
              className="metavariantOptions"
            />
          )}
        </div>
        <div>
          <label htmlFor="attributes">Attributes:</label>
          <Dropdown
            options={PriorityLetterOptions}
            value={priorityInfo.attributes}
            onChange={(arg) => {
              changePriorities(
                PrioritiesEnum.Attributes,
                priorityLetterEnum[arg.value as keyof typeof priorityLetterEnum]
              );
              const attributePoints = convertererer(
                priorityTable,
                priorityInfo.attributes,
                priorityCategoryEnum.Attributes
              );
              setPriorityAttributes(attributePoints.attributes);
            }}
            className="attributePriority"
          />
        </div>

        <div>
          <label htmlFor="talent">Talent:</label>
          <Dropdown
            options={PriorityLetterOptions}
            value={priorityInfo.talent}
            onChange={(arg) => {
              changePriorities(
                PrioritiesEnum.Talents,
                priorityLetterEnum[arg.value as keyof typeof priorityLetterEnum]
              );
            }}
            className="talentPriority"
          />

          <Dropdown
            options={talentOptions}
            value={priorityTalent.name}
            onChange={(arg) => {
              const talents = convertererer(
                priorityTable,
                priorityInfo.talent,
                priorityCategoryEnum.Talent
              );
              const talent = talents.talentList.find((talent) => {
                return talent.name === arg.value;
              });
              if (talent === undefined) {
                throw Error("talent is not defined");
              }
              setPriorityTalent(talent);
              const specialAttribute = specialAttributeInfo;
              switch (talent.category) {
                case talentCategoryEnum.Magic:
                  specialAttribute.talent = {
                    type: talentCategoryEnum.Magic,
                    magic: talent.magic,
                  };
                  break;
                case talentCategoryEnum.Depth:
                  specialAttribute.talent = {
                    type: talentCategoryEnum.Depth,
                    depth: talent.depth,
                  };
                  break;
                case talentCategoryEnum.Resonance:
                  specialAttribute.talent = {
                    type: talentCategoryEnum.Resonance,
                    resonance: talent.resonance,
                  };
                  break;
                case talentCategoryEnum.Mundane:
                  specialAttribute.talent = {
                    type: talentCategoryEnum.Mundane,
                  };
                  break;
              }
              setSpecialAttributeInfo(specialAttribute);
            }}
            placeholder={"Select an option"}
            className="talentOptions"
          />
        </div>
        <div>
          <label htmlFor="skills">Skills:</label>
          <Dropdown
            options={PriorityLetterOptions}
            value={priorityInfo.skills}
            onChange={(arg) => {
              const newPriority = arg.value as priorityLetterEnum;
              changePriorities(
                PrioritiesEnum.Skills,
                priorityLetterEnum[newPriority]
              );
              const skills = convertererer(
                priorityTable,
                newPriority,
                priorityCategoryEnum.Skills
              );
              setPrioritySkills(skills);
            }}
            className="skillPriority"
          />
        </div>
        <div>
          <label htmlFor="resources">Resources:</label>
          <Dropdown
            options={PriorityLetterOptions}
            value={priorityInfo.resources}
            onChange={(arg) => {
              changePriorities(
                PrioritiesEnum.Resources,
                priorityLetterEnum[arg.value as keyof typeof priorityLetterEnum]
              );
              const resources = convertererer(
                priorityTable,
                priorityInfo.resources,
                priorityCategoryEnum.Resources
              );
              setPriorityResources(resources.standard.resources);
            }}
            className="resourcePriority"
          />
        </div>
      </div>
    </Fragment>
  );
};

type SettingsKeyReturnType = {
  [priorityCategoryEnum.Heritage]: HeritageOptionsPriorityType;
  [priorityCategoryEnum.Attributes]: AttributePriorityType;
  [priorityCategoryEnum.Talent]: TalentOptionsPriorityType;
  [priorityCategoryEnum.Skills]: SkillPriorityType;
  [priorityCategoryEnum.Resources]: ResourceOptionsPriorityType;
};

function convertererer<T extends priorityCategoryEnum>(
  priorityTable: PriorityTableType,
  check: priorityLetterEnum,
  category: T
): SettingsKeyReturnType[T] {
  switch (check) {
    case priorityLetterEnum.A:
      return getPriority(priorityTable.A, category);
    case priorityLetterEnum.B:
      return getPriority(priorityTable.B, category);
    case priorityLetterEnum.C:
      return getPriority(priorityTable.C, category);
    case priorityLetterEnum.D:
      return getPriority(priorityTable.D, category);
    case priorityLetterEnum.E:
      return getPriority(priorityTable.E, category);
  }
}

function getPriority<T extends priorityCategoryEnum>(
  priority: PriorityType,
  category: T
): SettingsKeyReturnType[T] {
  // "as" casting is needed here due to typescript limitation
  switch (category) {
    case priorityCategoryEnum.Heritage:
      return priority.heritages as SettingsKeyReturnType[T];
    case priorityCategoryEnum.Attributes:
      return priority.attributes as SettingsKeyReturnType[T];
    case priorityCategoryEnum.Talent:
      return priority.talents as SettingsKeyReturnType[T];
    case priorityCategoryEnum.Skills:
      return priority.skills as SettingsKeyReturnType[T];
    case priorityCategoryEnum.Resources:
      return priority.resources as SettingsKeyReturnType[T];
    default:
      // eslint-disable-next-line no-case-declarations
      const _: never = category;
      return _;
  }
}
// function formatMagic(line: IMagicInfo) {
//   let magicResonance = "Magic";
//   let spellsForms = "Spells, rituals, and/or alchemical preparations";
//   if (line.magicType === MagicTypes[MagicTypeEnum.NotAwakened]) {
//     return "N/A";
//   } else if (line.magicType === MagicTypes[MagicTypeEnum.Technomancer]) {
//     magicResonance = "Resonance";
//     spellsForms = "Complex forms";
//   }
//   // Insert space between words
//   const magicType = line.magicType.replace(/[A-Z]/g, " $&").trim();
//   let magicianLine = magicType + ": " + magicResonance + " " + line.magicRating;
//   if (line.other.length > 0) {
//     magicianLine += ", " + line.other;
//   }
//   if (line.spells > 0) {
//     magicianLine += ", " + line.spells + " " + spellsForms;
//   }
//   return magicianLine;
// }
