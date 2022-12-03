import "./CharacterCreator.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type PriorityRow = {
  priority: string;
  metatype: string;
  attributes: string;
  magic: string;
  skills: string;
  resources: string;
};

const defaultData: PriorityRow[] = [
  {
    priority: "A",
    metatype:
      "Human (9)-" + "Elf (8)-" + "Dwarf (7)-" + "Ork (7)-" + "Troll (5)",
    attributes: "24",
    magic:
      "Magician or Mystic Adept: Magic 6, two Rating 5 Magical skills, 10 spells-" +
      "Technomancer: Resonance 6, two Rating 5 Resonance skills, 5 complex forms",
    skills: "46/10",
    resources: "450,000¥",
  },
  {
    priority: "B",
    metatype:
      "Human (7)-" + "Elf (6)-" + "Dwarf (4)-" + "Ork (4)-" + "Troll (0)",
    attributes: "20",
    magic:
      "Magician or Mystic Adept: Magic 4, two Rating 4 Magical skills, 7 spells-" +
      "Technomancer: Resonance 4, two Rating 4 Resonance skills, 2 complex forms-" +
      "Adept: Magic 6, one Rating 4 Active skill-" +
      "Aspected Magician: Magic 5, one Rating 4 Magical skill group",
    skills: "36/5",
    resources: "275,000¥",
  },
  {
    priority: "C",
    metatype: "Human (5)-" + "Elf (3)-" + "Dwarf (1)-" + "Ork (0)",
    attributes: "16",
    magic:
      "Magician or Mystic Adept: Magic 3, 5 spells-" +
      "Technomancer: Resonance 3, 1 complex form-" +
      "Adept: Magic 4, one Rating 2 Active skill-" +
      "Aspected Magician: Magic 3, one Rating 2 Magical skill group",
    skills: "28/2",
    resources: "140,000¥",
  },
  {
    priority: "D",
    metatype: "Human (3)-" + "Elf (0)",
    attributes: "14",
    magic: "Adept: Magic 2-" + "Aspected Magician: Magic 2",
    skills: "22/0",
    resources: "50,000¥",
  },
  {
    priority: "E",
    metatype: "Human (1)",
    attributes: "12",
    magic: "N/A",
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
      return info
        .getValue()
        .split("-")
        .map((line) => (
          <ul>
            <li>{line}</li>
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
      return info
        .getValue()
        .split("-")
        .map((line) => (
          <ul>
            <li>{line}</li>
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

const characterCreatorPath = "/character_creator";
const CharacterCreator = function () {
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

export { characterCreatorPath };
export default CharacterCreator;
