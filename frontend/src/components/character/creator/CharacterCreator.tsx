import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AttributeListSelect from "./AttributesSelect.js";
import PriorityListSelect from "./PrioritySelect.js";
import "./CharacterCreator.css";
import { QualityListSelect } from "./QualitiesSelect.js";
import { SkillListSelect } from "./SkillsSelect.js";
import { EquipmentSelect } from "./equipment/EquipmentSelect.js";
import { trpc } from "../../../utils/trpc.js";
import { CreatorSummary } from "./CreatorSummary.js";
import { TalentSelect } from "./TalentSelect.js";
import { MartialArtSelect } from "./MartialArtsSelect.js";
import { LifestyleSelect } from "./LifestyleSelect.js";
import { ArwesButton } from "../../common/ArwesButton.js";
import {
  initEquipmentWorker,
  getWorker,
} from "../../../hooks/useEquipmentSearch.js";
import { useCharacterDraft } from "../../../hooks/useCharacterDraft.js";

// Types
import type {
  CustomSkillListType,
  SelectedEquipmentListType,
  AttributesType,
  SpecialAttributesType,
  PriorityLevelsType,
  HeritagePrioritySelectedType,
  QualitySelectedListType,
  TalentInfoType,
  MartialArtSelectedType,
  LifestyleSelectedListType,
  SkillPriorityType,
  TalentPriorityType,
  CharacterCreatorBonusListType,
} from "@neon-codex/common";
import {
  priorityLetterEnum,
  characterCreatorStepEnum,
} from "@neon-codex/common";
import type { SkillPointInfoType } from "../commonSchemas.js";

const characterCreatorPath = "/character_creator";
const characterCreatorWithIdPath = "/character_creator/:id";

const CharacterCreator = function () {
  // Spawn worker immediately and defer equipment indexing until idle
  useEffect(() => {
    getWorker();
    let cancelled = false;
    const ensure = () => {
      if (!cancelled) initEquipmentWorker();
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(ensure, { timeout: 5000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const t = setTimeout(ensure, 1000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);
  const navigate = useNavigate();
  const character = trpc.character.createCharacter.useMutation();

  // Use the draft hook for all state management
  const {
    state,
    setState,
    isLoading,
    isSaving,
    error,
    version,
    conflict,
    resolveConflict,
    deleteDraft,
  } = useCharacterDraft();

  // Destructure state for easier access (read-only)
  const {
    bonusInfo,
    priorityInfo,
    attributeInfo,
    talentInfo,
    priorityHeritage,
    priorityAttributes,
    priorityTalent,
    prioritySkills: _a,
    priorityResources: _b,
    specialAttributeInfo,
    karmaPoints,
    essencePoints,
    positiveQualityListSelected,
    negativeQualityListSelected,
    skillPoints,
    skillSelections,
    skillGroupSelections,
    martialArtSelected,
    equipmentSelections,
    lifestyleSelections,
    nuyen,
    currentStep,
  } = state;

  // Preload equipment data when approaching the equipment step
  useEffect(() => {
    if (
      currentStep === characterCreatorStepEnum.SkillListSelect ||
      currentStep === characterCreatorStepEnum.MartialArtSelect ||
      currentStep === characterCreatorStepEnum.EquipmentListSelect
    ) {
      initEquipmentWorker();
    }
  }, [currentStep]);

  // Change handlers using setState
  const onBonusInfoChanged = (
    loadingBonusInfo: CharacterCreatorBonusListType
  ) => setState({ bonusInfo: loadingBonusInfo });

  const onPriorityInfoChanged = (newPriorities: PriorityLevelsType) =>
    setState({ priorityInfo: newPriorities });

  const onHeritageInfoChanged = (heritageInfo: HeritagePrioritySelectedType) =>
    setState({ priorityHeritage: heritageInfo });

  const onPriorityAttributesChanged = (loadingAttributes: number) =>
    setState({ priorityAttributes: loadingAttributes });

  const onPriorityTalentChanged = (loadingTalent: TalentPriorityType) =>
    setState({ priorityTalent: loadingTalent });

  const onPrioritySkillsChanged = (loadingSkills: SkillPriorityType) => {
    setState({
      prioritySkills: loadingSkills,
      skillPoints: loadingSkills,
    });
  };

  const onPriorityResources = (loadingResources: number) => {
    setState({
      priorityResources: loadingResources,
      nuyen: loadingResources,
    });
  };

  const onAttributeInfoChanged = (loadingAttributes: AttributesType) =>
    setState({ attributeInfo: loadingAttributes });

  const onSpecialAttributeInfoChanged = (
    loadingSpecialAttributes: SpecialAttributesType
  ) => setState({ specialAttributeInfo: loadingSpecialAttributes });

  const onTalentInfoChanged = (loadingTalentInfo: TalentInfoType) =>
    setState({ talentInfo: loadingTalentInfo });

  const onKarmaPointsChanged = (loadingKarma: number) =>
    setState({ karmaPoints: loadingKarma });

  const onEssencePointsChanged = (loadingEssence: number) =>
    setState({ essencePoints: loadingEssence });

  const onPositiveQualitiesSelectedChanged = (
    loadingPositiveQualities: QualitySelectedListType
  ) => setState({ positiveQualityListSelected: loadingPositiveQualities });

  const onNegativeQualitiesSelectedChanged = (
    loadingNegativeQualities: QualitySelectedListType
  ) => setState({ negativeQualityListSelected: loadingNegativeQualities });

  const onSkillPointChanged = (loadingSkillPoints: SkillPointInfoType) =>
    setState({ skillPoints: loadingSkillPoints });

  const onSkillSelectionsChanged = (
    loadingSkillSelection: CustomSkillListType
  ) => setState({ skillSelections: loadingSkillSelection });

  const onEquipmentSelectionsChanged = (
    equipmentSelections: SelectedEquipmentListType
  ) => setState({ equipmentSelections });

  const onNuyenChanged = (nuyen: number) => setState({ nuyen });

  const onMartialArtSelectionsChanged = (
    martialArtSelected: MartialArtSelectedType | undefined
  ) => setState({ martialArtSelected });

  const onLifestyleSelectedChanged = (
    lifestyleSelections: LifestyleSelectedListType
  ) => setState({ lifestyleSelections });

  // Navigation and Step Logic
  const PageActiveList =
    priorityInfo.talent === priorityLetterEnum.E
      ? [
          characterCreatorStepEnum.PriorityListSelect,
          characterCreatorStepEnum.AttributeListSelect,
          characterCreatorStepEnum.QualityListSelect,
          characterCreatorStepEnum.SkillListSelect,
          characterCreatorStepEnum.MartialArtSelect,
          characterCreatorStepEnum.EquipmentListSelect,
          characterCreatorStepEnum.LifestyleSelect,
          characterCreatorStepEnum.CreatorSummary,
        ]
      : [
          characterCreatorStepEnum.PriorityListSelect,
          characterCreatorStepEnum.AttributeListSelect,
          characterCreatorStepEnum.QualityListSelect,
          characterCreatorStepEnum.TalentListSelect,
          characterCreatorStepEnum.SkillListSelect,
          characterCreatorStepEnum.MartialArtSelect,
          characterCreatorStepEnum.EquipmentListSelect,
          characterCreatorStepEnum.LifestyleSelect,
          characterCreatorStepEnum.CreatorSummary,
        ];

  const [isSwitching, setIsSwitching] = useState(false);

  // Use currentStep directly instead of page state
  const page = currentStep;

  function changePage(newPage: typeof currentStep) {
    setIsSwitching(true);
    // Zero second timeout to allow the unmount hook to fire before mounting the new page
    setTimeout(() => {
      setState({ currentStep: newPage });
      setIsSwitching(false);
    }, 0);
  }

  if (isLoading) {
    return <div>Loading draft...</div>;
  }

  // Conflict Modal
  const conflictModal = conflict.hasConflict ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid #0ff",
          padding: "20px",
          maxWidth: "500px",
        }}
      >
        <h3 style={{ color: "#0ff" }}>Sync Conflict Detected</h3>
        <p>This draft was updated in another session.</p>
        <p>
          Server version: {conflict.serverVersion} (Your version: {version})
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <ArwesButton onClick={() => resolveConflict("loadServer")}>
            Load Latest (Discard Local)
          </ArwesButton>
          <ArwesButton onClick={() => resolveConflict("overwrite")}>
            Overwrite Server (Keep Local)
          </ArwesButton>
        </div>
      </div>
    </div>
  ) : null;

  let currentStage = <></>;
  if (!isSwitching) {
    switch (page) {
      case characterCreatorStepEnum.PriorityListSelect:
        currentStage = (
          <PriorityListSelect
            priorityInfo={priorityInfo}
            setPriorityInfo={onPriorityInfoChanged}
            priorityHeritage={priorityHeritage}
            setPriorityHeritage={onHeritageInfoChanged}
            setPriorityAttributes={onPriorityAttributesChanged}
            setPriorityTalent={onPriorityTalentChanged}
            setPrioritySkills={onPrioritySkillsChanged}
            setPriorityResources={onPriorityResources}
            specialAttributeInfo={specialAttributeInfo}
            setSpecialAttributeInfo={onSpecialAttributeInfoChanged}
            priorityTalent={priorityTalent}
            setTalentInfo={onTalentInfoChanged}
          />
        );
        break;
      case characterCreatorStepEnum.AttributeListSelect:
        currentStage = (
          <AttributeListSelect
            priorityInfo={priorityInfo}
            heritageInfo={priorityHeritage}
            attributeInfo={attributeInfo}
            setAttributeInfo={onAttributeInfoChanged}
            specialAttributeInfo={specialAttributeInfo}
            setSpecialAttributeInfo={onSpecialAttributeInfoChanged}
            maxAttributePoints={priorityAttributes}
            talentInfo={priorityTalent}
            bonusInfo={bonusInfo}
            setBonusInfo={onBonusInfoChanged}
          />
        );
        break;
      case characterCreatorStepEnum.QualityListSelect:
        currentStage = (
          <QualityListSelect
            karmaPoints={karmaPoints}
            setKarmaPoints={onKarmaPointsChanged}
            positiveQualitiesSelected={positiveQualityListSelected}
            setPositiveQualitiesSelected={onPositiveQualitiesSelectedChanged}
            negativeQualitiesSelected={negativeQualityListSelected}
            setNegativeQualitiesSelected={onNegativeQualitiesSelectedChanged}
            bonusInfo={bonusInfo}
            setBonusInfo={onBonusInfoChanged}
          />
        );
        break;
      case characterCreatorStepEnum.TalentListSelect:
        currentStage = (
          <TalentSelect
            talent={priorityTalent}
            talentInfo={talentInfo}
            setTalentInfo={onTalentInfoChanged}
            karmaPoints={karmaPoints}
            essencePoints={essencePoints}
            bonusInfo={bonusInfo}
            setBonusInfo={onBonusInfoChanged}
          />
        );
        break;
      case characterCreatorStepEnum.SkillListSelect:
        currentStage = (
          <SkillListSelect
            skillPointItems={skillPoints}
            setSkillPoints={onSkillPointChanged}
            skillSelections={skillSelections}
            setSkillSelections={onSkillSelectionsChanged}
            bonusInfo={bonusInfo}
            setBonusInfo={onBonusInfoChanged}
          />
        );
        break;
      case characterCreatorStepEnum.MartialArtSelect:
        currentStage = (
          <MartialArtSelect
            karmaPoints={karmaPoints}
            setKarmaPoints={onKarmaPointsChanged}
            martialArtSelected={martialArtSelected}
            setMartialArtSelected={onMartialArtSelectionsChanged}
          />
        );
        break;
      case characterCreatorStepEnum.EquipmentListSelect:
        currentStage = (
          <EquipmentSelect
            equipmentSelections={equipmentSelections}
            setEquipmentSelections={onEquipmentSelectionsChanged}
            nuyen={nuyen}
            setNuyen={onNuyenChanged}
            essencePoints={essencePoints}
            setEssencePoints={onEssencePointsChanged}
            bonusInfo={bonusInfo}
            setBonusInfo={onBonusInfoChanged}
            heritageInfo={priorityHeritage}
            positiveQualityListSelected={positiveQualityListSelected}
            negativeQualityListSelected={negativeQualityListSelected}
            skillSelections={skillSelections}
            talentInfo={talentInfo}
            attributeInfo={attributeInfo}
            specialAttributeInfo={specialAttributeInfo}
            martialArtSelected={martialArtSelected}
            lifestyleSelections={lifestyleSelections}
          />
        );
        break;
      case characterCreatorStepEnum.LifestyleSelect:
        currentStage = (
          <LifestyleSelect
            lifestyleSelections={lifestyleSelections}
            setLifestyleSelections={onLifestyleSelectedChanged}
          />
        );
        break;
      case characterCreatorStepEnum.CreatorSummary:
        currentStage = (
          <CreatorSummary
            priorityInfo={priorityInfo}
            heritageInfo={priorityHeritage}
            attributeInfo={attributeInfo}
            specialAttributeInfo={specialAttributeInfo}
            talentInfo={talentInfo}
            positiveQualitiesSelected={positiveQualityListSelected}
            negativeQualitiesSelected={negativeQualityListSelected}
            skillPoints={skillPoints}
            skillSelections={skillSelections}
            skillGroupSelections={skillGroupSelections}
            martialArtSelected={martialArtSelected}
            equipmentSelections={equipmentSelections}
            lifestyleSelections={lifestyleSelections}
            karmaPoints={karmaPoints}
            nuyen={nuyen}
            bonusInfo={bonusInfo}
          />
        );
        break;

      default:
        currentStage = <>Error</>;
    }
  }

  const lastPage = PageActiveList.length - 1;
  const hiddenNext = page === PageActiveList[lastPage];
  const hiddenSubmit = page !== PageActiveList[lastPage];

  return (
    <Fragment>
      {conflictModal}
      {error && (
        <div
          style={{
            background: "rgba(255, 0, 0, 0.2)",
            color: "#ff9999",
            padding: "10px",
            border: "1px solid red",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}
      {isSaving && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            color: "#0ff",
            textShadow: "0 0 5px #0ff",
            zIndex: 1000,
          }}
        >
          Saving...
        </div>
      )}

      <div
        data-testid="ready"
        style={{ overflowX: "auto", marginBottom: "20px" }}
      >
        <nav className="character-creator-nav">
          {PageActiveList.map((pageItem) => {
            const isActive = page === pageItem;
            return (
              <div
                key={pageItem}
                className={`character-creator-nav-item ${
                  isActive ? "active" : ""
                }`}
              >
                {pageItem.replace(/([A-Z])/g, " $1").trim()}
              </div>
            );
          })}
        </nav>
      </div>
      <div>Karma Remaining: {karmaPoints}</div>
      <div>Essence Remaining: {essencePoints}</div>
      <ArwesButton
        onClick={() => {
          changePage(
            page !== characterCreatorStepEnum.PriorityListSelect
              ? PageActiveList[
                  PageActiveList.findIndex((element) => element === page) - 1
                ]
              : characterCreatorStepEnum.PriorityListSelect
          );
        }}
        disabled={page === characterCreatorStepEnum.PriorityListSelect}
      >
        Previous
      </ArwesButton>
      {!hiddenNext && (
        <ArwesButton
          onClick={() => {
            changePage(
              page !== PageActiveList[lastPage]
                ? PageActiveList[
                    PageActiveList.findIndex((element) => element === page) + 1
                  ]
                : PageActiveList[lastPage]
            );
          }}
        >
          Next
        </ArwesButton>
      )}
      {}
      {currentStage}
      {!hiddenSubmit && (
        <ArwesButton
          onClick={() => {
            character
              .mutateAsync({
                priorityInfo: priorityInfo,
                heritageInfo: priorityHeritage,
                attributeInfo: attributeInfo,
                specialAttributeInfo: specialAttributeInfo,
                talentInfo: talentInfo,
                positiveQualityListSelected: positiveQualityListSelected,
                negativeQualityListSelected: negativeQualityListSelected,
                skillSelections: skillSelections,
                skillGroupSelections: skillGroupSelections,
                ...(martialArtSelected !== undefined && {
                  martialArtSelected: martialArtSelected,
                }),
                equipmentSelections: equipmentSelections,
                lifestyleSelections: lifestyleSelections,
                karmaPoints: karmaPoints,
                nuyen: nuyen,
                bonusInfo: bonusInfo,
              })
              .then(async (characterId) => {
                await deleteDraft(); // Clean up draft on successful creation
                navigate(`/characters/${characterId}`);
              })
              .catch((err) => {
                // TODO: handle this
                console.log(err);
              });
          }}
        >
          Submit
        </ArwesButton>
      )}
    </Fragment>
  );
};

export { characterCreatorPath, characterCreatorWithIdPath };
export default CharacterCreator;
