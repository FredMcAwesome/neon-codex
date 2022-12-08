import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import uniqid from "uniqid";

export enum PriorityLevelEnum {
  A,
  B,
  C,
  D,
  E,
}
type PriorityLevelKey = keyof typeof PriorityLevelEnum;

export enum MetatypeEnum {
  Human,
  Elf,
  Dwarf,
  Ork,
  Troll,
}
type MetatypeKey = keyof typeof MetatypeEnum;
const Metatypes: Array<MetatypeKey> = ["Human", "Elf", "Dwarf", "Ork", "Troll"];
type SpecialAttributes = number;
interface IMetatypeInfo {
  metatype: MetatypeKey;
  specialAttributes: SpecialAttributes;
}

export enum MagicTypeEnum {
  Adept,
  AspectedMagician,
  Magician,
  MysticAdept,
  NotAwakened,
  Technomancer,
}
type MagicTypeKey = keyof typeof MagicTypeEnum;
const MagicTypes: Array<MagicTypeKey> = [
  "Adept",
  "AspectedMagician",
  "Magician",
  "MysticAdept",
  "NotAwakened",
  "Technomancer",
];
type MagicRating = number;
type Spells = number;
interface IMagicInfo {
  magicType: MagicTypeKey;
  magicRating: MagicRating;
  spells: Spells;
  other: string;
}

interface ISkills {
  skillPoints: number;
  skillGroupPoints: number;
}

export interface IPriorities {
  MetatypePriority: PriorityLevelEnum;
  MetatypeSubselection: MetatypeEnum;
  AttributesPriority: PriorityLevelEnum;
  MagicPriority: PriorityLevelEnum;
  MagicSubselection: MagicTypeEnum;
  SkillsPriority: PriorityLevelEnum;
  ResourcesPriority: PriorityLevelEnum;
}

interface IPriorityRow {
  priority: PriorityLevelEnum;
  metatypeInfo: Array<IMetatypeInfo>;
  attributes: number;
  magicInfo: Array<IMagicInfo>;
  skills: ISkills;
  resources: number;
}

export const priorityOptions: IPriorityRow[] = [
  {
    priority: PriorityLevelEnum.A,
    metatypeInfo: [
      { metatype: Metatypes[MetatypeEnum.Human], specialAttributes: 9 },
      { metatype: Metatypes[MetatypeEnum.Elf], specialAttributes: 8 },
      { metatype: Metatypes[MetatypeEnum.Dwarf], specialAttributes: 7 },
      { metatype: Metatypes[MetatypeEnum.Ork], specialAttributes: 7 },
      { metatype: Metatypes[MetatypeEnum.Troll], specialAttributes: 5 },
    ],
    attributes: 24,
    magicInfo: [
      {
        magicType: MagicTypes[MagicTypeEnum.Magician],
        magicRating: 6,
        other: "two Rating 5 Magical skills",
        spells: 10,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.MysticAdept],
        magicRating: 6,
        other: "two Rating 5 Magical skills",
        spells: 10,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.Technomancer],
        magicRating: 6,
        other:
          "three Rating 5 skills from Resonance, Electronics, or Cracking skills groups",
        spells: 7,
      },
    ],
    skills: { skillPoints: 46, skillGroupPoints: 10 },
    resources: 450000,
  },
  {
    priority: PriorityLevelEnum.B,
    metatypeInfo: [
      { metatype: Metatypes[MetatypeEnum.Human], specialAttributes: 7 },
      { metatype: Metatypes[MetatypeEnum.Elf], specialAttributes: 6 },
      { metatype: Metatypes[MetatypeEnum.Dwarf], specialAttributes: 4 },
      { metatype: Metatypes[MetatypeEnum.Ork], specialAttributes: 4 },
      { metatype: Metatypes[MetatypeEnum.Troll], specialAttributes: 0 },
    ],
    attributes: 20,
    magicInfo: [
      {
        magicType: MagicTypes[MagicTypeEnum.Magician],
        magicRating: 4,
        other: "two Rating 4 Magical skills",
        spells: 7,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.MysticAdept],
        magicRating: 4,
        other: "two Rating 4 Magical skills",
        spells: 7,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.Technomancer],
        magicRating: 4,
        other:
          "three Rating 4 skills from Resonance, Electronics, or Cracking skills groups",
        spells: 4,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.Adept],
        magicRating: 6,
        other: "one Rating 4 Active skill",
        spells: 0,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.AspectedMagician],
        magicRating: 5,
        other: "one Rating 4 Magical skill group",
        spells: 0,
      },
    ],
    skills: { skillPoints: 36, skillGroupPoints: 5 },
    resources: 275000,
  },
  {
    priority: PriorityLevelEnum.C,
    metatypeInfo: [
      { metatype: Metatypes[MetatypeEnum.Human], specialAttributes: 5 },
      { metatype: Metatypes[MetatypeEnum.Elf], specialAttributes: 3 },
      { metatype: Metatypes[MetatypeEnum.Dwarf], specialAttributes: 1 },
      { metatype: Metatypes[MetatypeEnum.Ork], specialAttributes: 0 },
    ],
    attributes: 16,
    magicInfo: [
      {
        magicType: MagicTypes[MagicTypeEnum.Magician],
        magicRating: 3,
        other: "",
        spells: 5,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.MysticAdept],
        magicRating: 3,
        other: "",
        spells: 5,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.Technomancer],
        magicRating: 3,
        other:
          "three Rating 2 skills from Resonance, Electronics, or Cracking skills groups",
        spells: 3,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.Adept],
        magicRating: 4,
        other: "one Rating 2 Active skill",
        spells: 0,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.AspectedMagician],
        magicRating: 3,
        other: "one Rating 2 Magical skill group",
        spells: 0,
      },
    ],
    skills: { skillPoints: 28, skillGroupPoints: 2 },
    resources: 140000,
  },
  {
    priority: PriorityLevelEnum.D,
    metatypeInfo: [
      { metatype: Metatypes[MetatypeEnum.Human], specialAttributes: 3 },
      { metatype: Metatypes[MetatypeEnum.Elf], specialAttributes: 0 },
    ],
    attributes: 14,
    magicInfo: [
      {
        magicType: MagicTypes[MagicTypeEnum.Adept],
        magicRating: 2,
        other: "",
        spells: 0,
      },
      {
        magicType: MagicTypes[MagicTypeEnum.AspectedMagician],
        magicRating: 2,
        other: "",
        spells: 0,
      },
    ],
    skills: { skillPoints: 22, skillGroupPoints: 0 },
    resources: 50000,
  },
  {
    priority: PriorityLevelEnum.E,
    metatypeInfo: [
      { metatype: Metatypes[MetatypeEnum.Human], specialAttributes: 1 },
    ],
    attributes: 12,
    magicInfo: [
      {
        magicType: MagicTypes[MagicTypeEnum.NotAwakened],
        magicRating: 0,
        other: "",
        spells: 0,
      },
    ],
    skills: { skillPoints: 18, skillGroupPoints: 0 },
    resources: 6000,
  },
];

const columnHelper = createColumnHelper<IPriorityRow>();

const columns = [
  columnHelper.accessor("priority", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("metatypeInfo", {
    header: "Metatype",
    cell: (info) => {
      return info.getValue().map((line) => (
        <ul>
          <li key={uniqid()}>
            {line.metatype + " (" + line.specialAttributes + ")"}
          </li>
        </ul>
      ));
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("attributes", {
    header: "Attributes",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("magicInfo", {
    header: "Magic or Resonance",
    cell: (info) => {
      return info.getValue().map((line) => {
        const magicianLine = formatMagic(line);
        return (
          <ul>
            <li key={uniqid()}>{magicianLine}</li>
          </ul>
        );
      });
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("skills", {
    header: "Skills",
    cell: (info) => {
      return formatSkills(info.getValue());
    },

    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("resources", {
    header: "Resources",
    cell: (info) => {
      return formatResources(info.getValue());
    },
    footer: (info) => info.column.id,
  }),
];

const PrioritiesTable = function () {
  // useReactTable can't use defaultData directly for some reason...
  const data = [...priorityOptions];
  const table = useReactTable({
    data,
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
      {/* <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody> */}
    </table>
  );
};

const metatypeSummaries = [
  "A - Any metatype",
  "B - Any metatype",
  "C - Human, Dwarf, Elf, or Ork",
  "D - Human or Elf",
  "E - Human",
];

const attributesSummaries = priorityOptions.map(
  (priorityList) =>
    PriorityLevelEnum[priorityList.priority] + " - " + priorityList.attributes
);

const magicSummaries = [
  "A - Magician or Technomancer",
  "B - Adept, Magician, or Technomancer",
  "C - Adept, Magician, or Technomancer",
  "D - Adept or Aspected Magician",
  "E - Mundane",
];
const skillsSummaries = priorityOptions.map(
  (priorityList) =>
    PriorityLevelEnum[priorityList.priority] +
    " - " +
    formatSkills(priorityList.skills)
);
const resourcesSummaries = priorityOptions.map((priorityList) => {
  return (
    PriorityLevelEnum[priorityList.priority] +
    " - " +
    formatResources(priorityList.resources)
  );
});

interface IProps {
  priorityInfo: IPriorities;
  setPriorityInfo: React.Dispatch<React.SetStateAction<IPriorities>>;
}

enum PrioritiesEnum {
  Metatype,
  Attributes,
  Magic,
  Skills,
  Resources,
}

const PrioritySelect = function (props: IProps) {
  const priorityLevels: Array<PriorityLevelEnum> = [
    props.priorityInfo.MetatypePriority,
    props.priorityInfo.AttributesPriority,
    props.priorityInfo.MagicPriority,
    props.priorityInfo.SkillsPriority,
    props.priorityInfo.ResourcesPriority,
  ];
  const [priorities, setPriorities] = useState(priorityLevels);
  // Todo: add css effect when another option changes so it is obvious which other column was affected
  function changePriorities(column: PrioritiesEnum, newPriorityString: string) {
    const newPriority =
      PriorityLevelEnum[newPriorityString as PriorityLevelKey];
    const newPriorities = [...priorities];
    for (let i = 0; i < priorities.length; i++) {
      if (priorities[i] === newPriority) {
        newPriorities[i] = newPriorities[column];
        newPriorities[column] = newPriority;
        break;
      }
    }
    const priority = props.priorityInfo;
    priority.MetatypePriority = newPriorities[PrioritiesEnum.Metatype];
    priority.AttributesPriority = newPriorities[PrioritiesEnum.Attributes];
    priority.MagicPriority = newPriorities[PrioritiesEnum.Magic];
    priority.SkillsPriority = newPriorities[PrioritiesEnum.Skills];
    priority.ResourcesPriority = newPriorities[PrioritiesEnum.Resources];
    props.setPriorityInfo(priority);
    setPriorities(newPriorities);
  }

  useEffect(() => {
    const metatypeRow = priorityOptions.find(
      (row) => row.priority === priorities[PrioritiesEnum.Metatype]
    );
    setMetatypeOptions(
      metatypeRow?.metatypeInfo.map(
        (metaOption) =>
          metaOption.metatype + " (" + metaOption.specialAttributes + ")"
      ) || ["Error"]
    );
    const magicRow = priorityOptions.find(
      (row) => row.priority === priorities[PrioritiesEnum.Magic]
    );
    let magicArray: string[];
    if (!magicRow) {
      magicArray = ["Error"];
    } else {
      magicArray = magicRow.magicInfo.map((line) => {
        return formatMagic(line);
      });
    }

    setMagicOptions(magicArray);
  }, [priorities]);

  const [metatypeOptions, setMetatypeOptions] = useState(() => {
    const row = priorityOptions.find(
      (row) => row.priority === priorities[PrioritiesEnum.Metatype]
    );
    return (
      row?.metatypeInfo.map(
        (metaOption) =>
          metaOption.metatype + " (" + metaOption.specialAttributes + ")"
      ) || ["Error"]
    );
  });
  const [metatypeSelection, setMetatypeSelection] = useState<MetatypeEnum>(
    props.priorityInfo.MetatypeSubselection
  );
  const [magicOptions, setMagicOptions] = useState(() => {
    const row = priorityOptions.find(
      (row) => row.priority === priorities[PrioritiesEnum.Metatype]
    );
    if (!row) return ["Error"];
    return row.magicInfo.map((line) => {
      return formatMagic(line);
    });
  });
  const [magicSelection, setMagicSelection] = useState<MagicTypeEnum>(
    props.priorityInfo.MagicSubselection
  );

  return (
    <React.Fragment>
      <PrioritiesTable />
      <div>
        <div>
          <label htmlFor="metatype">Metatype:</label>
          <Dropdown
            options={metatypeSummaries}
            value={metatypeSummaries[priorities[PrioritiesEnum.Metatype]]}
            onChange={(arg) =>
              changePriorities(
                PrioritiesEnum.Metatype,
                arg.value.substring(0, 1)
              )
            }
            placeholder={"Select an option"}
          />

          <Dropdown
            options={metatypeOptions}
            value={metatypeOptions[metatypeSelection]}
            onChange={(arg) => {
              const temp = metatypeOptions.findIndex(
                (row) => row === arg.value
              );
              setMetatypeSelection(temp);
              const priority = props.priorityInfo;
              priority.MetatypeSubselection = temp;
              props.setPriorityInfo(priority);
            }}
            placeholder={"Select an option"}
          />
        </div>
        <div>
          <label htmlFor="attributes">Attributes:</label>
          <Dropdown
            options={attributesSummaries}
            value={attributesSummaries[priorities[PrioritiesEnum.Attributes]]}
            onChange={(arg) =>
              changePriorities(
                PrioritiesEnum.Attributes,
                arg.value.substring(0, 1)
              )
            }
            placeholder={"Select an option"}
          />
        </div>
        <div>
          <label htmlFor="magic">Magic:</label>
          <Dropdown
            options={magicSummaries}
            value={magicSummaries[priorities[PrioritiesEnum.Magic]]}
            onChange={(arg) =>
              changePriorities(PrioritiesEnum.Magic, arg.value.substring(0, 1))
            }
            placeholder={"Select an option"}
          />

          <Dropdown
            options={magicOptions}
            value={magicOptions[magicSelection]}
            onChange={(arg) => {
              const row = magicOptions.findIndex((row) => row === arg.value);
              setMagicSelection(row);
              const priority = props.priorityInfo;
              priority.MagicSubselection = row;
              props.setPriorityInfo(priority);
            }}
            placeholder={"Select an option"}
          />
        </div>
        <div>
          <label htmlFor="skills">Skills:</label>
          <Dropdown
            options={skillsSummaries}
            value={skillsSummaries[priorities[PrioritiesEnum.Skills]]}
            onChange={(arg) =>
              changePriorities(PrioritiesEnum.Skills, arg.value.substring(0, 1))
            }
            placeholder={"Select an option"}
          />
        </div>
        <div>
          <label htmlFor="resources">Resources:</label>
          <Dropdown
            options={resourcesSummaries}
            value={resourcesSummaries[priorities[PrioritiesEnum.Resources]]}
            onChange={(arg) =>
              changePriorities(
                PrioritiesEnum.Resources,
                arg.value.substring(0, 1)
              )
            }
            placeholder={"Select an option"}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrioritySelect;

function formatMagic(line: IMagicInfo) {
  let magicResonance = "Magic";
  let spellsForms = "Spells, rituals, and/or alchemical preparations";
  if (line.magicType === MagicTypes[MagicTypeEnum.NotAwakened]) {
    return "N/A";
  } else if (line.magicType === MagicTypes[MagicTypeEnum.Technomancer]) {
    magicResonance = "Resonance";
    spellsForms = "Complex forms";
  }
  // Insert space between words
  const magicType = line.magicType.replace(/[A-Z]/g, " $&").trim();
  let magicianLine = magicType + ": " + magicResonance + " " + line.magicRating;
  if (line.other.length > 0) {
    magicianLine += ", " + line.other;
  }
  if (line.spells > 0) {
    magicianLine += ", " + line.spells + " " + spellsForms;
  }
  return magicianLine;
}

function formatSkills(line: ISkills) {
  return line.skillPoints + "/" + line.skillGroupPoints;
}

function formatResources(line: number) {
  // toLocaleString adds commas to number
  return line.toLocaleString() + "¥";
}
