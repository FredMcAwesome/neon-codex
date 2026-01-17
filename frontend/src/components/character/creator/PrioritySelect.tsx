import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArwesSelect } from "../../common/ArwesSelect.js";
import {
  PrioritiesEnum,
  type PriorityLevelsType,
  type SpecialAttributesType,
  type HeritagePrioritySelectedType,
  type TalentInfoType,
} from "@neon-codex/common";
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
} from "@neon-codex/common";
import {
  priorityCategoryEnum,
  priorityLetterEnum,
  priorityTableRunnerLevelEnum,
  talentCategoryEnum,
} from "@neon-codex/common";
import { getPriorityData } from "../../../utils/priority.js";

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
    <div className="priority-table-container">
      <table id="priority_table">
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
    </div>
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
  setTalentInfo: (loadingTalentInfo: TalentInfoType) => void;
}

const PriorityListSelect = function (props: IProps) {
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
      priorityInfo={props.priorityInfo}
      setPriorityInfo={props.setPriorityInfo}
      priorityHeritage={props.priorityHeritage}
      setPriorityHeritage={props.setPriorityHeritage}
      setPriorityAttributes={props.setPriorityAttributes}
      setPriorityTalent={props.setPriorityTalent}
      setPrioritySkills={props.setPrioritySkills}
      setPriorityResources={props.setPriorityResources}
      specialAttributeInfo={props.specialAttributeInfo}
      setSpecialAttributeInfo={props.setSpecialAttributeInfo}
      priorityTalent={props.priorityTalent}
      setTalentInfo={props.setTalentInfo}
    />
  );
};

export default PriorityListSelect;

type PrioritySelectLoadedProps = IProps & { priorityTable: PriorityTableType };

const PrioritySelectLoaded = function (props: PrioritySelectLoadedProps) {
  // Local state - initialized from props, synced to parent on unmount
  const [localPriorityInfo, setLocalPriorityInfo] = useState(
    props.priorityInfo
  );

  const [localHeritage, setLocalHeritage] = useState(() => {
    if (props.priorityHeritage.heritage !== "") {
      return props.priorityHeritage;
    }
    const heritages = getPriorityData(
      props.priorityTable,
      props.priorityInfo.heritage,
      priorityCategoryEnum.Heritage
    );
    // Default to first option
    const defaultHeritage = heritages.heritageList[0];
    return {
      heritage: defaultHeritage.name,
      specialAttributePoints: defaultHeritage.specialAttributePoints,
    };
  });

  const [localTalent, setLocalTalent] = useState(() => {
    if (props.priorityTalent.name !== "") {
      return props.priorityTalent;
    }
    const talents = getPriorityData(
      props.priorityTable,
      props.priorityInfo.talent,
      priorityCategoryEnum.Talent
    );
    // Default to first option
    return talents.talentList[0];
  });

  const [localSpecialAttributeInfo, setLocalSpecialAttributeInfo] = useState(
    () => {
      const params = props.specialAttributeInfo;
      // Check if the passed special attributes match the talent category (which might be defaulted locally)
      if (params.talent.category === localTalent.category) {
        return params;
      }

      const newAttr = { ...params };
      switch (localTalent.category) {
        case talentCategoryEnum.Magic:
          newAttr.talent = {
            category: talentCategoryEnum.Magic,
            magic: localTalent.magic,
          };
          break;
        case talentCategoryEnum.Depth:
          newAttr.talent = {
            category: talentCategoryEnum.Depth,
            depth: localTalent.depth,
          };
          break;
        case talentCategoryEnum.Resonance:
          newAttr.talent = {
            category: talentCategoryEnum.Resonance,
            resonance: localTalent.resonance,
          };
          break;
        case talentCategoryEnum.Mundane:
          newAttr.talent = {
            category: talentCategoryEnum.Mundane,
          };
          break;
      }
      return newAttr;
    }
  );

  // Refs to track current values for cleanup (avoids stale closure)
  const priorityInfoRef = useRef(localPriorityInfo);
  const heritageRef = useRef(localHeritage);
  const talentRef = useRef(localTalent);
  const specialAttrRef = useRef(localSpecialAttributeInfo);

  useEffect(() => {
    priorityInfoRef.current = localPriorityInfo;
  }, [localPriorityInfo]);
  useEffect(() => {
    heritageRef.current = localHeritage;
  }, [localHeritage]);
  useEffect(() => {
    talentRef.current = localTalent;
  }, [localTalent]);
  useEffect(() => {
    specialAttrRef.current = localSpecialAttributeInfo;
  }, [localSpecialAttributeInfo]);

  // Sync to parent on unmount (page navigation)
  useEffect(() => {
    return () => {
      props.setPriorityInfo(priorityInfoRef.current);
      props.setPriorityHeritage(heritageRef.current);
      props.setPriorityTalent(talentRef.current);
      // Update TalentInfo based on category
      const talentCategory = talentRef.current.category;

      let specialAttribute = specialAttrRef.current;
      // Safety check: ensure special attribute matches talent category
      if (specialAttribute.talent.category !== talentCategory) {
        specialAttribute = { ...specialAttribute };
        switch (talentCategory) {
          case talentCategoryEnum.Magic:
            specialAttribute.talent = {
              category: talentCategoryEnum.Magic,
              magic: talentRef.current.magic,
            };
            break;
          case talentCategoryEnum.Depth:
            specialAttribute.talent = {
              category: talentCategoryEnum.Depth,
              depth: talentRef.current.depth,
            };
            break;
          case talentCategoryEnum.Resonance:
            specialAttribute.talent = {
              category: talentCategoryEnum.Resonance,
              resonance: talentRef.current.resonance,
            };
            break;
          case talentCategoryEnum.Mundane:
            specialAttribute.talent = {
              category: talentCategoryEnum.Mundane,
            };
            break;
        }
      }
      props.setSpecialAttributeInfo(specialAttribute);

      // Calculate and sync derived priority details
      const priorities = priorityInfoRef.current;

      const attributePoints = getPriorityData(
        props.priorityTable,
        priorities.attributes,
        priorityCategoryEnum.Attributes
      );
      props.setPriorityAttributes(attributePoints.attributes);

      const skillPriorities = getPriorityData(
        props.priorityTable,
        priorities.skills,
        priorityCategoryEnum.Skills
      );
      props.setPrioritySkills(skillPriorities);

      const resourceOptions = getPriorityData(
        props.priorityTable,
        priorities.resources,
        priorityCategoryEnum.Resources
      );
      props.setPriorityResources(resourceOptions.standard.resources);

      switch (talentCategory) {
        case talentCategoryEnum.Magic: {
          const formulae =
            talentRef.current.formulae !== undefined
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
            talentRef.current.name === "Adept" ||
            talentRef.current.name === "Mystic Adept"
              ? {
                  selectAdeptPowers: true as const,
                  adeptPowers: [],
                }
              : {
                  selectAdeptPowers: false as const,
                };
          props.setTalentInfo({
            category: talentCategoryEnum.Magic,
            selectedTradition: {
              name: "",
              customSpirits: {
                customSpirits: false,
              },
            },
            selectedFormulae: formulae,
            selectedAdeptPowers: powers,
          });
          break;
        }
        case talentCategoryEnum.Resonance:
          props.setTalentInfo({
            category: talentCategoryEnum.Resonance,
            complexForms: [],
          });
          break;
        case talentCategoryEnum.Depth:
          props.setTalentInfo({
            category: talentCategoryEnum.Depth,
            programs: [],
          });
          break;
        case talentCategoryEnum.Mundane:
          props.setTalentInfo({
            category: talentCategoryEnum.Mundane,
          });
          break;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Todo: add css effect when another option changes so it is obvious which other column was affected
  function changePriorities(
    column: PrioritiesEnum,
    newPriority: priorityLetterEnum
  ) {
    const newPriorities = { ...localPriorityInfo };
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
    if (localPriorityInfo.heritage === newPriority) {
      newPriorities.heritage = changedPriority;
    } else if (localPriorityInfo.attributes === newPriority) {
      newPriorities.attributes = changedPriority;
    } else if (localPriorityInfo.talent === newPriority) {
      newPriorities.talent = changedPriority;
    } else if (localPriorityInfo.skills === newPriority) {
      newPriorities.skills = changedPriority;
    } else if (localPriorityInfo.resources === newPriority) {
      newPriorities.resources = changedPriority;
    }

    setLocalPriorityInfo(newPriorities);
  }

  let metavariantOptions: Array<string> = [];

  const heritages = getPriorityData(
    props.priorityTable,
    localPriorityInfo.heritage,
    priorityCategoryEnum.Heritage
  );
  const heritageOptions = heritages.heritageList.map((heritage) => {
    return heritage.name;
  });
  const heritage = heritages.heritageList.find((heritageLocal) => {
    return (
      heritageLocal.name === localHeritage.heritage &&
      heritageLocal.specialAttributePoints ===
        localHeritage.specialAttributePoints
    );
  });
  if (heritage !== undefined && heritage.metavariantList !== undefined) {
    metavariantOptions = heritage.metavariantList.map(
      (metavariant) => metavariant.name
    );
  } else {
    metavariantOptions = [];
  }

  const talents = getPriorityData(
    props.priorityTable,
    localPriorityInfo.talent,
    priorityCategoryEnum.Talent
  );
  const talentOptions = talents.talentList.map((talentLocal) => {
    return talentLocal.name;
  });

  return (
    <Fragment>
      <h1>Priority Selection</h1>
      <PrioritiesTable
        priorityTable={props.priorityTable}
        runnerLevel={priorityTableRunnerLevelEnum.StreetLevel}
      />
      <div className="priority-selection-container">
        <div className="priority-selection-row">
          <label htmlFor="heritage">Heritage:</label>
          <ArwesSelect
            value={localPriorityInfo.heritage}
            onChange={(e) => {
              changePriorities(
                PrioritiesEnum.Heritage,
                priorityLetterEnum[
                  e.target.value as keyof typeof priorityLetterEnum
                ]
              );
            }}
            className="heritagePriority"
          >
            {PriorityLetterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <ArwesSelect
              value={localHeritage.heritage}
              onChange={(e) => {
                const heritages = getPriorityData(
                  props.priorityTable,
                  localPriorityInfo.heritage,
                  priorityCategoryEnum.Heritage
                );
                const baseHeritage = heritages.heritageList.find((heritage) => {
                  return heritage.name === e.target.value;
                });
                if (baseHeritage === undefined) {
                  throw Error("baseHeritage is not defined");
                }
                const newHeritage = { ...localHeritage };
                newHeritage.heritage = baseHeritage.name;
                newHeritage.specialAttributePoints =
                  baseHeritage.specialAttributePoints;
                delete newHeritage.metavariant;
                setLocalHeritage(newHeritage);
              }}
              className="heritageOptions"
            >
              {heritageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </ArwesSelect>
            {metavariantOptions.length > 0 && (
              <ArwesSelect
                value={
                  typeof localHeritage.metavariant === "string"
                    ? localHeritage.metavariant
                    : ""
                }
                onChange={(e) => {
                  const heritages = getPriorityData(
                    props.priorityTable,
                    localPriorityInfo.heritage,
                    priorityCategoryEnum.Heritage
                  );
                  const baseHeritage = heritages.heritageList.find(
                    (heritage) => {
                      return heritage.name === localHeritage.heritage;
                    }
                  );
                  if (baseHeritage === undefined) {
                    throw Error("baseHeritage is not defined");
                  }
                  if (baseHeritage.metavariantList === undefined) {
                    throw Error("baseHeritage metavariant list is not defined");
                  }
                  const metavariant = baseHeritage.metavariantList.find(
                    (metavariant) => {
                      return metavariant.name === e.target.value;
                    }
                  );
                  if (metavariant === undefined) {
                    throw Error("metavariant is not defined");
                  }
                  const newHeritage = { ...localHeritage };
                  newHeritage.metavariant = metavariant.name;
                  newHeritage.specialAttributePoints =
                    metavariant.specialAttributePoints;
                  setLocalHeritage(newHeritage);
                }}
                className="metavariantOptions"
              >
                {metavariantOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </ArwesSelect>
            )}
          </div>
        </div>

        <div className="priority-selection-row">
          <label htmlFor="attributes">Attributes:</label>
          <ArwesSelect
            value={localPriorityInfo.attributes}
            onChange={(e) => {
              changePriorities(
                PrioritiesEnum.Attributes,
                priorityLetterEnum[
                  e.target.value as keyof typeof priorityLetterEnum
                ]
              );
            }}
            className="attributePriority"
          >
            {PriorityLetterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
          <div></div> {/* Spacer for grid */}
        </div>

        <div className="priority-selection-row">
          <label htmlFor="talent">Talent:</label>
          <ArwesSelect
            value={localPriorityInfo.talent}
            onChange={(e) => {
              changePriorities(
                PrioritiesEnum.Talents,
                priorityLetterEnum[
                  e.target.value as keyof typeof priorityLetterEnum
                ]
              );
            }}
            className="talentPriority"
          >
            {PriorityLetterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>

          <ArwesSelect
            value={localTalent.name}
            onChange={(e) => {
              const talents = getPriorityData(
                props.priorityTable,
                localPriorityInfo.talent,
                priorityCategoryEnum.Talent
              );
              const talent = talents.talentList.find((talent) => {
                return talent.name === e.target.value;
              });
              if (talent === undefined) {
                throw Error("talent is not defined");
              }
              setLocalTalent(talent);
              const specialAttribute = { ...localSpecialAttributeInfo };
              switch (talent.category) {
                case talentCategoryEnum.Magic:
                  specialAttribute.talent = {
                    category: talentCategoryEnum.Magic,
                    magic: talent.magic,
                  };
                  break;
                case talentCategoryEnum.Depth:
                  specialAttribute.talent = {
                    category: talentCategoryEnum.Depth,
                    depth: talent.depth,
                  };
                  break;
                case talentCategoryEnum.Resonance:
                  specialAttribute.talent = {
                    category: talentCategoryEnum.Resonance,
                    resonance: talent.resonance,
                  };
                  break;
                case talentCategoryEnum.Mundane:
                  specialAttribute.talent = {
                    category: talentCategoryEnum.Mundane,
                  };
                  break;
              }
              setLocalSpecialAttributeInfo(specialAttribute);
            }}
            className="talentOptions"
          >
            {talentOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
        </div>

        <div className="priority-selection-row">
          <label htmlFor="skills">Skills:</label>
          <ArwesSelect
            value={localPriorityInfo.skills}
            onChange={(e) => {
              const newPriority = e.target.value as priorityLetterEnum;
              changePriorities(
                PrioritiesEnum.Skills,
                priorityLetterEnum[newPriority]
              );
            }}
            className="skillPriority"
          >
            {PriorityLetterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
          <div></div> {/* Spacer for grid */}
        </div>

        <div className="priority-selection-row">
          <label htmlFor="resources">Resources:</label>
          <ArwesSelect
            value={localPriorityInfo.resources}
            onChange={(e) => {
              changePriorities(
                PrioritiesEnum.Resources,
                priorityLetterEnum[
                  e.target.value as keyof typeof priorityLetterEnum
                ]
              );
            }}
            className="resourcePriority"
          >
            {PriorityLetterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </ArwesSelect>
          <div></div> {/* Spacer for grid */}
        </div>
      </div>
    </Fragment>
  );
};

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
