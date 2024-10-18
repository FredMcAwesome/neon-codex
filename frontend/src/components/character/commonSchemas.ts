import type { BonusSourceEnum } from "@neon-codex/common/build/enums.js";

export type SkillPointInfoType = {
  skillPoints: number;
  skillGroupPoints: number;
};

type BonusSourceType =
  | {
      sourceType: BonusSourceEnum.Quality;
    }
  | {
      sourceType: BonusSourceEnum.Tradition;
    };

export type CharacterCreatorBonusType = {
  // TODO: this should probably be the id once the xmls are mapped
  // with primary keys
  source: string;
  linkMentorSpirit?: true;
  linkParagon?: true;
} & BonusSourceType;

export type CharacterCreatorBonusListType = Array<CharacterCreatorBonusType>;
