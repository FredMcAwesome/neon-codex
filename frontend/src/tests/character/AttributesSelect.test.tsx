import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "../../utils/TestingUtils.js";
import {
  PriorityLevelEnum,
  MetatypeEnum,
  MagicTypeEnum,
  priorityOptions,
} from "../../components/character/PriorityImports.js";
import AttributesSelect from "../../components/character/AttributesSelect.js";

const priorityInfo = {
  MetatypePriority: PriorityLevelEnum.A,
  MetatypeSubselection: MetatypeEnum.Human,
  AttributesPriority: PriorityLevelEnum.B,
  MagicPriority: PriorityLevelEnum.C,
  MagicSubselection: MagicTypeEnum.Magician,
  SkillsPriority: PriorityLevelEnum.D,
  ResourcesPriority: PriorityLevelEnum.E,
};
let attributePointsMax = 0;

beforeAll(
  () =>
    (attributePointsMax =
      priorityOptions[priorityInfo.AttributesPriority].attributes)
);

function defaultPageRender() {
  const attributeInfo = {
    body: 1,
    agility: 1,
    reaction: 1,
    strength: 1,
    willpower: 1,
    logic: 1,
    intuition: 1,
    charisma: 1,
    edge: 0,
  };
  const { container } = renderWithProviders(
    <AttributesSelect
      priorityInfo={priorityInfo}
      attributeInfo={attributeInfo}
      setAttributeInfo={jest.fn()}
      maxAttributePoints={attributePointsMax}
    />
  );
  return container;
}

test("Attributes Select change body", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const bodySelect: HTMLSelectElement = screen.getByTestId("body");
  expect(bodySelect.value).toBe("1");

  fireEvent.change(bodySelect, {
    target: {
      value: "6",
    },
  });

  expect(bodySelect.value).not.toBe("1");
  expect(bodySelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change agility", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const agilitySelect: HTMLSelectElement = screen.getByTestId("agility");
  expect(agilitySelect.value).toBe("1");

  fireEvent.change(agilitySelect, {
    target: {
      value: "6",
    },
  });

  expect(agilitySelect.value).not.toBe("1");
  expect(agilitySelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change reaction", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const reactionSelect: HTMLSelectElement = screen.getByTestId("reaction");
  expect(reactionSelect.value).toBe("1");

  fireEvent.change(reactionSelect, {
    target: {
      value: "6",
    },
  });

  expect(reactionSelect.value).not.toBe("1");
  expect(reactionSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change strength", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const strengthSelect: HTMLSelectElement = screen.getByTestId("strength");
  expect(strengthSelect.value).toBe("1");

  fireEvent.change(strengthSelect, {
    target: {
      value: "6",
    },
  });

  expect(strengthSelect.value).not.toBe("1");
  expect(strengthSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change willpower", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const willpowerSelect: HTMLSelectElement = screen.getByTestId("willpower");
  expect(willpowerSelect.value).toBe("1");

  fireEvent.change(willpowerSelect, {
    target: {
      value: "6",
    },
  });

  expect(willpowerSelect.value).not.toBe("1");
  expect(willpowerSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change logic", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const logicSelect: HTMLSelectElement = screen.getByTestId("logic");
  expect(logicSelect.value).toBe("1");

  fireEvent.change(logicSelect, {
    target: {
      value: "6",
    },
  });

  expect(logicSelect.value).not.toBe("1");
  expect(logicSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change intuition", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const intuitionSelect: HTMLSelectElement = screen.getByTestId("intuition");
  expect(intuitionSelect.value).toBe("1");

  fireEvent.change(intuitionSelect, {
    target: {
      value: "6",
    },
  });

  expect(intuitionSelect.value).not.toBe("1");
  expect(intuitionSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change charisma", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const charismaSelect: HTMLSelectElement = screen.getByTestId("charisma");
  expect(charismaSelect.value).toBe("1");

  fireEvent.change(charismaSelect, {
    target: {
      value: "6",
    },
  });

  expect(charismaSelect.value).not.toBe("1");
  expect(charismaSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 5);
});

test("Attributes Select change edge", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const startPoints = parseInt(attributePoints.innerHTML);
  const edgeSelect: HTMLSelectElement = screen.getByTestId("edge");
  expect(edgeSelect.value).toBe("2");

  fireEvent.change(edgeSelect, {
    target: {
      value: "6",
    },
  });

  expect(edgeSelect.value).not.toBe("2");
  expect(edgeSelect.value).toBe("6");
  expect(parseInt(attributePoints.innerHTML)).toBe(startPoints - 4);
});

test("Attributes Select change initiative", () => {
  const container = defaultPageRender();
  const initiativeSelect: HTMLParagraphElement =
    container.querySelector("#initiative")!;
  const reactionSelect: HTMLSelectElement = screen.getByTestId("reaction");
  const intuitionSelect: HTMLSelectElement = screen.getByTestId("intuition");
  expect(initiativeSelect.innerHTML).toBe("2");

  fireEvent.change(reactionSelect, {
    target: {
      value: "6",
    },
  });

  expect(initiativeSelect.innerHTML).toBe("7");

  fireEvent.change(intuitionSelect, {
    target: {
      value: "5",
    },
  });

  expect(initiativeSelect.innerHTML).toBe("11");
});

test("Attributes Select only 1 stat at max value", () => {
  defaultPageRender();
  const bodySelect: HTMLSelectElement = screen.getByTestId("body");
  const agilitySelect: HTMLSelectElement = screen.getByTestId("agility");

  fireEvent.change(bodySelect, {
    target: {
      value: "6",
    },
  });
  expect(within(agilitySelect).queryByText("5")).toBeInTheDocument();
  expect(within(agilitySelect).queryByText("6")).not.toBeInTheDocument();
});

test("Attributes Select can only spend up to attribute points", () => {
  defaultPageRender();
  const attributePoints: HTMLSpanElement = screen.getByText(attributePointsMax);
  const bodySelect: HTMLSelectElement = screen.getByTestId("body");
  const agilitySelect: HTMLSelectElement = screen.getByTestId("agility");
  const reactionSelect: HTMLSelectElement = screen.getByTestId("reaction");
  const strengthSelect: HTMLSelectElement = screen.getByTestId("strength");
  const willpowerSelect: HTMLSelectElement = screen.getByTestId("willpower");
  const logicSelect: HTMLSelectElement = screen.getByTestId("logic");

  fireEvent.change(bodySelect, {
    target: {
      value: "5",
    },
  });
  fireEvent.change(agilitySelect, {
    target: {
      value: "5",
    },
  });
  fireEvent.change(reactionSelect, {
    target: {
      value: "5",
    },
  });
  fireEvent.change(strengthSelect, {
    target: {
      value: "5",
    },
  });
  fireEvent.change(willpowerSelect, {
    target: {
      value: "5",
    },
  });

  expect(parseInt(attributePoints.innerHTML)).toBe(0);

  expect(within(logicSelect).queryByText("6")).not.toBeInTheDocument();
  expect(within(logicSelect).queryByText("5")).not.toBeInTheDocument();
  expect(within(logicSelect).queryByText("4")).not.toBeInTheDocument();
  expect(within(logicSelect).queryByText("3")).not.toBeInTheDocument();
  expect(within(logicSelect).queryByText("2")).not.toBeInTheDocument();
});
