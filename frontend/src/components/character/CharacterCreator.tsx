import "./CharacterCreator.css";
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

type PriorityRow = {
  priority: string;
  metatype: Array<string>;
  attributes: string;
  magic: Array<string>;
  skills: string;
  resources: string;
};

const defaultData: PriorityRow[] = [
  {
    priority: "A",
    metatype: ["Human (9)", "Elf (8)", "Dwarf (7)", "Ork (7)", "Troll (5)"],
    attributes: "24",
    magic: [
      "Magician or Mystic Adept: Magic 6, two Rating 5 Magical skills, 10 spells",
      "Technomancer: Resonance 6, two Rating 5 Resonance skills, 5 complex forms",
    ],
    skills: "46/10",
    resources: "450,000¥",
  },
  {
    priority: "B",
    metatype: ["Human (7)", "Elf (6)", "Dwarf (4)", "Ork (4)", "Troll (0)"],
    attributes: "20",
    magic: [
      "Magician or Mystic Adept: Magic 4, two Rating 4 Magical skills, 7 spells",
      "Technomancer: Resonance 4, two Rating 4 Resonance skills, 2 complex forms",
      "Adept: Magic 6, one Rating 4 Active skill",
      "Aspected Magician: Magic 5, one Rating 4 Magical skill group",
    ],
    skills: "36/5",
    resources: "275,000¥",
  },
  {
    priority: "C",
    metatype: ["Human (5)", "Elf (3)", "Dwarf (1)", "Ork (0)"],
    attributes: "16",
    magic: [
      "Magician or Mystic Adept: Magic 3, 5 spells",
      "Technomancer: Resonance 3, 1 complex form",
      "Adept: Magic 4, one Rating 2 Active skill",
      "Aspected Magician: Magic 3, one Rating 2 Magical skill group",
    ],
    skills: "28/2",
    resources: "140,000¥",
  },
  {
    priority: "D",
    metatype: ["Human (3)", "Elf (0)"],
    attributes: "14",
    magic: ["Adept: Magic 2", "Aspected Magician: Magic 2"],
    skills: "22/0",
    resources: "50,000¥",
  },
  {
    priority: "E",
    metatype: ["Human (1)"],
    attributes: "12",
    magic: ["N/A"],
    skills: "18/0",
    resources: "6,000¥",
  },
];

const columnHelper = createColumnHelper<PriorityRow>();

const columns = [
  columnHelper.accessor("priority", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("metatype", {
    header: "Metatype",
    cell: (info) => {
      return info.getValue().map((line) => (
        <ul>
          <li key={uniqid()}>{line}</li>
        </ul>
      ));
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("attributes", {
    header: "Attributes",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("magic", {
    header: "Magic or Resonance",
    cell: (info) => {
      return info.getValue().map((line) => (
        <ul>
          <li key={uniqid()}>{line}</li>
        </ul>
      ));
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("skills", {
    header: "Skills",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("resources", {
    header: "Resources",
    footer: (info) => info.column.id,
  }),
];

const PrioritiesTable = function () {
  // useReactTable can't use defaultData directly for some reason...
  const data = [...defaultData];
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

const characterCreatorPath = "/character_creator";
const CharacterCreator = function () {
  const priorityLevels = ["A", "B", "C", "D", "E"];
  enum Priorities {
    Metatype,
    Attributes,
    Magic,
    Skills,
    Resources,
  }
  type Subselection = {
    enabled: boolean;
    selection: number;
  };
  const [priorities, setPriorities] = useState(priorityLevels);
  // Todo: add css effect when another option changes so it is obvious which other column was affected
  function changePriorities(column: Priorities, newPriority: string) {
    const temp = priorities[column];
    for (let i = 0; i < priorities.length; i++) {
      if (priorities[i] === newPriority) {
        const newPriorities = [...priorities];
        newPriorities[i] = temp;
        newPriorities[column] = newPriority;
        setPriorities(newPriorities);
        break;
      }
    }
  }

  useEffect(() => {
    const metatypeRow = defaultData.find(
      (row) => row.priority === priorities[Priorities.Metatype]
    );
    setMetatypeOptions(metatypeRow?.metatype || ["Error"]);
    const attributesRow = defaultData.find(
      (row) => row.priority === priorities[Priorities.Attributes]
    );
    setAttributes(attributesRow?.attributes || "Error");
    const magicRow = defaultData.find(
      (row) => row.priority === priorities[Priorities.Magic]
    );
    setMagicOptions(magicRow?.magic || ["Error"]);
    const skillsRow = defaultData.find(
      (row) => row.priority === priorities[Priorities.Skills]
    );
    setSkills(skillsRow?.skills || "Error");
    const row = defaultData.find(
      (row) => row.priority === priorities[Priorities.Resources]
    );
    setResources(row?.resources || "Error");
  }, [priorities]);

  const [metatypeOptions, setMetatypeOptions] = useState(() => {
    const row = defaultData.find(
      (row) => row.priority === priorities[Priorities.Metatype]
    );
    return row?.metatype || ["Error"];
  });
  const [metatypeSelection, setMetatypeSelection] = useState<Subselection>({
    enabled: true,
    selection: 0,
  });
  const [attributes, setAttributes] = useState(() => {
    const row = defaultData.find(
      (row) => row.priority === priorities[Priorities.Attributes]
    );
    return row?.attributes || "Error";
  });
  const [magicOptions, setMagicOptions] = useState(() => {
    const row = defaultData.find(
      (row) => row.priority === priorities[Priorities.Metatype]
    );
    return row?.magic || ["Error"];
  });
  const [magicSelection, setMagicSelection] = useState<Subselection>({
    enabled: true,
    selection: 0,
  });
  const [skills, setSkills] = useState(() => {
    const row = defaultData.find(
      (row) => row.priority === priorities[Priorities.Skills]
    );
    return row?.skills || "Error";
  });
  const [resources, setResources] = useState(() => {
    const row = defaultData.find(
      (row) => row.priority === priorities[Priorities.Resources]
    );
    return row?.resources || "Error";
  });

  return (
    <React.Fragment>
      <PrioritiesTable />
      <div>
        <div>
          <label htmlFor="metatype">Metatype:</label>
          <Dropdown
            options={priorityLevels}
            value={priorities[Priorities.Metatype]}
            onChange={(arg) => changePriorities(Priorities.Metatype, arg.value)}
            placeholder={"Select an option"}
          />
          {metatypeSelection.enabled && (
            <Dropdown
              options={metatypeOptions}
              value={metatypeOptions[metatypeSelection.selection]}
              onChange={(arg) => {
                const selection = metatypeSelection;
                selection.selection = metatypeOptions.findIndex(
                  (row) => row === arg.value
                );
                setMetatypeSelection(selection);
              }}
              placeholder={"Select an option"}
            />
          )}
        </div>
        <div>
          <label htmlFor="attributes">Attributes:</label>
          <Dropdown
            options={priorityLevels}
            value={priorities[Priorities.Attributes]}
            onChange={(arg) =>
              changePriorities(Priorities.Attributes, arg.value)
            }
            placeholder={"Select an option"}
          />
          <p>{attributes}</p>
        </div>
        <div>
          <label htmlFor="magic">Magic:</label>
          <Dropdown
            options={priorityLevels}
            value={priorities[Priorities.Magic]}
            onChange={(arg) => changePriorities(Priorities.Magic, arg.value)}
            placeholder={"Select an option"}
          />
          {magicSelection.enabled && (
            <Dropdown
              options={magicOptions}
              value={magicOptions[magicSelection.selection]}
              onChange={(arg) => {
                const selection = magicSelection;
                selection.selection = magicOptions.findIndex(
                  (row) => row === arg.value
                );
                setMagicSelection(selection);
              }}
              placeholder={"Select an option"}
            />
          )}
        </div>
        <div>
          <label htmlFor="skills">Skills:</label>
          <Dropdown
            options={priorityLevels}
            value={priorities[Priorities.Skills]}
            onChange={(arg) => changePriorities(Priorities.Skills, arg.value)}
            placeholder={"Select an option"}
          />
          <p>{skills}</p>
        </div>
        <div>
          <label htmlFor="resources">Resources:</label>
          <Dropdown
            options={priorityLevels}
            value={priorities[Priorities.Resources]}
            onChange={(arg) =>
              changePriorities(Priorities.Resources, arg.value)
            }
            placeholder={"Select an option"}
          />
          <p>{resources}</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export { characterCreatorPath };
export default CharacterCreator;
