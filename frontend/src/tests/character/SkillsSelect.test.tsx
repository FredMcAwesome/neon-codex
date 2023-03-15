import { fireEvent, screen, within } from "@testing-library/react";
import { useState } from "react";
import { ISkillPoints } from "../../components/character/PriorityImports.js";
import { SkillSelectList } from "../../components/character/SkillsSelect.js";
import {
  IActiveSkillSelection,
  skillList,
} from "@shadowrun/common/src/Skills.js";
import { renderWithProviders } from "../../utils/TestingUtils.js";

test("Skills increase", () => {
  renderWithProviders(<DefaultPageRender startSkillPoints={100} />);
  const combatSelect: HTMLSelectElement = screen.getByLabelText("Archery");

  fireEvent.change(combatSelect, {
    target: {
      value: "2",
    },
  });
  expect(combatSelect.value).toContain("2");
  const physicalSelect: HTMLSelectElement = screen.getByLabelText("Disguise");

  fireEvent.change(physicalSelect, {
    target: {
      value: "2",
    },
  });
  expect(physicalSelect.value).toContain("2");
  const socialSelect: HTMLSelectElement = screen.getByLabelText("Con");

  fireEvent.change(socialSelect, {
    target: {
      value: "2",
    },
  });
  expect(socialSelect.value).toContain("2");
  const magicSelect: HTMLSelectElement = screen.getByLabelText("Alchemy");

  fireEvent.change(magicSelect, {
    target: {
      value: "2",
    },
  });
  expect(magicSelect.value).toContain("2");
  const resonanceSelect: HTMLSelectElement = screen.getByLabelText("Compiling");

  fireEvent.change(resonanceSelect, {
    target: {
      value: "2",
    },
  });
  expect(resonanceSelect.value).toContain("2");
  const technicalSelect: HTMLSelectElement = screen.getByLabelText(
    "Aeronautics Mechanic"
  );

  fireEvent.change(technicalSelect, {
    target: {
      value: "2",
    },
  });
  expect(technicalSelect.value).toContain("2");
  const vehicleSelect: HTMLSelectElement = screen.getByLabelText("Gunnery");

  fireEvent.change(vehicleSelect, {
    target: {
      value: "2",
    },
  });
  expect(vehicleSelect.value).toContain("2");
});

test("Can only spend up to skill points", () => {
  renderWithProviders(<DefaultPageRender startSkillPoints={10} />);
  const skillPoints: HTMLSpanElement = within(
    screen.getByText("Skill Points Remaining:")
  ).getByText("10");
  const combatSelect: HTMLSelectElement = screen.getByLabelText("Archery");

  fireEvent.change(combatSelect, {
    target: {
      value: "10",
    },
  });
  expect(combatSelect.value).toContain("10");

  expect(parseInt(skillPoints.innerHTML)).toBe(0);

  const physicalSelect: HTMLSelectElement = screen.getByLabelText("Disguise");
  expect(within(physicalSelect).queryByText("12")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("11")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("10")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("9")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("8")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("7")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("6")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("5")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("4")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("3")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("2")).not.toBeInTheDocument();
  expect(within(physicalSelect).queryByText("1")).not.toBeInTheDocument();
});

function DefaultPageRender({
  startSkillPoints: startSkillPoints,
}: {
  startSkillPoints: number;
}) {
  const [skillPoints, setSkillPoints] = useState<ISkillPoints>({
    skillPoints: startSkillPoints,
    skillGroupPoints: 0,
  });
  const [skillSelections, setSkillSelections] = useState<
    Array<IActiveSkillSelection>
  >(
    skillList.map((skill) => ({
      ...skill,
      pointsInvested: 0,
    }))
  );

  const onSkillPointChange = function (loadingSkillPoints: ISkillPoints) {
    setSkillPoints(loadingSkillPoints);
  };
  const onSkillSelections = function (
    loadingSkillSelection: Array<IActiveSkillSelection>
  ) {
    setSkillSelections(loadingSkillSelection);
  };

  return (
    <SkillSelectList
      skillPointItems={skillPoints}
      setSkillPoints={onSkillPointChange}
      skillSelections={skillSelections}
      setSkillSelections={onSkillSelections}
    />
  );
}
