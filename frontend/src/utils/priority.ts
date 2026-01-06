import {
  priorityCategoryEnum,
  priorityLetterEnum,
  type AttributePriorityType,
  type HeritageOptionsPriorityType,
  type PriorityTableType,
  type PriorityType,
  type ResourceOptionsPriorityType,
  type SkillPriorityType,
  type TalentOptionsPriorityType,
} from "@neon-codex/common";

export type SettingsKeyReturnType = {
  [priorityCategoryEnum.Heritage]: HeritageOptionsPriorityType;
  [priorityCategoryEnum.Attributes]: AttributePriorityType;
  [priorityCategoryEnum.Talent]: TalentOptionsPriorityType;
  [priorityCategoryEnum.Skills]: SkillPriorityType;
  [priorityCategoryEnum.Resources]: ResourceOptionsPriorityType;
};

export function getPriorityData<T extends priorityCategoryEnum>(
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

export function getPriority<T extends priorityCategoryEnum>(
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
