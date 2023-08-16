import { makeRecipe } from "ohm-js";
const result = makeRecipe([
  "grammar",
  {
    source:
      'Range {\n  Exp = Range\n  Range = Range "*" RangeValue -- multiply\n    | Range "/" RangeValue -- divide\n    | RangeValue\n  RangeValue = Strength\n    | Number\n  Strength = "{STR}"\n  Number = "-" PositiveNumber -- negative\n    | PositiveNumber\n  PositiveNumber = digit+ "." digit+ -- float\n    | digit+ -- int\n}',
  },
  "Range",
  null,
  "Exp",
  {
    Exp: [
      "define",
      { sourceInterval: [10, 21] },
      null,
      [],
      ["app", { sourceInterval: [16, 21] }, "Range", []],
    ],
    Range_multiply: [
      "define",
      { sourceInterval: [32, 64] },
      null,
      [],
      [
        "seq",
        { sourceInterval: [32, 52] },
        ["app", { sourceInterval: [32, 37] }, "Range", []],
        ["terminal", { sourceInterval: [38, 41] }, "*"],
        ["app", { sourceInterval: [42, 52] }, "RangeValue", []],
      ],
    ],
    Range_divide: [
      "define",
      { sourceInterval: [71, 101] },
      null,
      [],
      [
        "seq",
        { sourceInterval: [71, 91] },
        ["app", { sourceInterval: [71, 76] }, "Range", []],
        ["terminal", { sourceInterval: [77, 80] }, "/"],
        ["app", { sourceInterval: [81, 91] }, "RangeValue", []],
      ],
    ],
    Range: [
      "define",
      { sourceInterval: [24, 118] },
      null,
      [],
      [
        "alt",
        { sourceInterval: [32, 118] },
        ["app", { sourceInterval: [32, 52] }, "Range_multiply", []],
        ["app", { sourceInterval: [71, 91] }, "Range_divide", []],
        ["app", { sourceInterval: [108, 118] }, "RangeValue", []],
      ],
    ],
    RangeValue: [
      "define",
      { sourceInterval: [121, 155] },
      null,
      [],
      [
        "alt",
        { sourceInterval: [134, 155] },
        ["app", { sourceInterval: [134, 142] }, "Strength", []],
        ["app", { sourceInterval: [149, 155] }, "Number", []],
      ],
    ],
    Strength: [
      "define",
      { sourceInterval: [158, 176] },
      null,
      [],
      ["terminal", { sourceInterval: [169, 176] }, "{STR}"],
    ],
    Number_negative: [
      "define",
      { sourceInterval: [188, 218] },
      null,
      [],
      [
        "seq",
        { sourceInterval: [188, 206] },
        ["terminal", { sourceInterval: [188, 191] }, "-"],
        ["app", { sourceInterval: [192, 206] }, "PositiveNumber", []],
      ],
    ],
    Number: [
      "define",
      { sourceInterval: [179, 239] },
      null,
      [],
      [
        "alt",
        { sourceInterval: [188, 239] },
        ["app", { sourceInterval: [188, 206] }, "Number_negative", []],
        ["app", { sourceInterval: [225, 239] }, "PositiveNumber", []],
      ],
    ],
    PositiveNumber_float: [
      "define",
      { sourceInterval: [259, 285] },
      null,
      [],
      [
        "seq",
        { sourceInterval: [259, 276] },
        [
          "plus",
          { sourceInterval: [259, 265] },
          ["app", { sourceInterval: [259, 264] }, "digit", []],
        ],
        ["terminal", { sourceInterval: [266, 269] }, "."],
        [
          "plus",
          { sourceInterval: [270, 276] },
          ["app", { sourceInterval: [270, 275] }, "digit", []],
        ],
      ],
    ],
    PositiveNumber_int: [
      "define",
      { sourceInterval: [292, 305] },
      null,
      [],
      [
        "plus",
        { sourceInterval: [292, 298] },
        ["app", { sourceInterval: [292, 297] }, "digit", []],
      ],
    ],
    PositiveNumber: [
      "define",
      { sourceInterval: [242, 305] },
      null,
      [],
      [
        "alt",
        { sourceInterval: [259, 305] },
        ["app", { sourceInterval: [259, 276] }, "PositiveNumber_float", []],
        ["app", { sourceInterval: [292, 298] }, "PositiveNumber_int", []],
      ],
    ],
  },
]);
export default result;
