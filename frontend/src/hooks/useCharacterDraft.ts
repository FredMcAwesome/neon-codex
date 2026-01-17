import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "../utils/trpc.js";
import type {
  AttributesType,
  CharacterCreatorBonusListType,
  CustomSkillGroupListType,
  CustomSkillListType,
  DraftCharacterDataType,
  HeritagePrioritySelectedType,
  LifestyleSelectedListType,
  MartialArtSelectedType,
  PriorityLevelsType,
  QualitySelectedListType,
  SelectedEquipmentListType,
  SpecialAttributesType,
  TalentInfoType,
  CharacterCreatorStepType,
} from "@neon-codex/common";
import {
  priorityLetterEnum,
  talentCategoryEnum,
  characterCreatorStepEnum,
} from "@neon-codex/common";
import type { SkillPriorityType, TalentPriorityType } from "@neon-codex/common";
import type { SkillPointInfoType } from "../components/character/commonSchemas.js";

// Local storage key patterns
const DRAFT_STORAGE_KEY_PREFIX = "character-draft-";
const SESSION_DRAFT_KEY = "character-draft-session";

// Debounce delays
const LOCAL_SAVE_DELAY = 500; // 500ms for localStorage
const SERVER_SAVE_DELAY = 5000; // 5 seconds for server

/**
 * Full state for character creation.
 * This matches the fields in CharacterCreator.tsx
 */
export interface CharacterCreatorState {
  bonusInfo: CharacterCreatorBonusListType;
  priorityInfo: PriorityLevelsType;
  attributeInfo: AttributesType;
  talentInfo: TalentInfoType;
  priorityHeritage: HeritagePrioritySelectedType;
  priorityAttributes: number;
  priorityTalent: TalentPriorityType;
  prioritySkills: SkillPriorityType;
  priorityResources: number;
  specialAttributeInfo: SpecialAttributesType;
  karmaPoints: number;
  essencePoints: number;
  positiveQualityListSelected: QualitySelectedListType;
  negativeQualityListSelected: QualitySelectedListType;
  skillPoints: SkillPointInfoType;
  skillSelections: CustomSkillListType;
  skillGroupSelections: CustomSkillGroupListType;
  martialArtSelected: MartialArtSelectedType | undefined;
  equipmentSelections: SelectedEquipmentListType;
  lifestyleSelections: LifestyleSelectedListType;
  nuyen: number;
  currentStep: CharacterCreatorStepType;
}

const getDefaultState = (): CharacterCreatorState => ({
  bonusInfo: [],
  priorityInfo: {
    heritage: priorityLetterEnum.A,
    attributes: priorityLetterEnum.B,
    talent: priorityLetterEnum.C,
    skills: priorityLetterEnum.D,
    resources: priorityLetterEnum.E,
  },
  attributeInfo: {
    body: 1,
    agility: 1,
    reaction: 1,
    strength: 1,
    willpower: 1,
    logic: 1,
    intuition: 1,
    charisma: 1,
  },
  talentInfo: {
    category: talentCategoryEnum.Mundane,
  },
  priorityHeritage: {
    heritage: "",
    specialAttributePoints: 0,
  },
  priorityAttributes: 0,
  priorityTalent: {
    name: "",
    label: "",
    category: talentCategoryEnum.Mundane,
  },
  prioritySkills: {
    name: "",
    skillPoints: 0,
    skillGroupPoints: 0,
  },
  priorityResources: 0,
  specialAttributeInfo: {
    edge: 0,
    talent: { category: talentCategoryEnum.Mundane },
  },
  karmaPoints: 25,
  essencePoints: 6,
  positiveQualityListSelected: [],
  negativeQualityListSelected: [],
  skillPoints: {
    skillPoints: 0,
    skillGroupPoints: 0,
  },
  skillSelections: [],
  skillGroupSelections: [],
  martialArtSelected: undefined,
  equipmentSelections: {
    equipmentPackList: [],
    weaponList: [],
    gearList: [],
    armourList: [],
    augmentationList: [],
    vehicleList: [],
  },
  lifestyleSelections: [],
  nuyen: 0,
  currentStep: characterCreatorStepEnum.PriorityListSelect,
});

interface LocalStorageData {
  data: CharacterCreatorState;
  version: number;
  pendingSync: boolean;
  draftId: number | null;
}

interface ConflictInfo {
  hasConflict: boolean;
  serverVersion?: number;
  serverData?: DraftCharacterDataType;
}

export interface UseCharacterDraftReturn {
  state: CharacterCreatorState;
  setState: (newState: Partial<CharacterCreatorState>) => void;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  draftId: number | null;
  version: number;
  conflict: ConflictInfo;
  resolveConflict: (action: "loadServer" | "overwrite") => void;
  deleteDraft: () => Promise<void>;
}

export function useCharacterDraft(): UseCharacterDraftReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const draftIdFromUrl = id ? parseInt(id, 10) : null;

  const [state, setStateInternal] = useState<CharacterCreatorState>(
    getDefaultState()
  );
  const [draftId, setDraftId] = useState<number | null>(draftIdFromUrl);
  const [version, setVersion] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(!!draftIdFromUrl);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictInfo>({
    hasConflict: false,
  });

  // Track if initial load is done
  const initialLoadDone = useRef(false);

  // Debounce timers
  const localSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serverSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track last synced state to avoid redundant saves
  const lastSyncedJson = useRef<string | null>(null);

  // TRPC mutations
  const createDraftMutation = trpc.character.createDraftCharacter.useMutation();
  const updateDraftMutation = trpc.character.updateDraftCharacter.useMutation();
  const deleteDraftMutation = trpc.character.deleteDraftCharacter.useMutation();

  // TRPC query for loading draft
  const draftQuery = trpc.character.getDraftCharacter.useQuery(
    draftIdFromUrl ?? 0,
    {
      enabled: draftIdFromUrl !== null && !isNaN(draftIdFromUrl),
      retry: false,
    }
  );

  // Convert state to DraftCharacterDataType for server
  // Use conditional spread to handle exactOptionalPropertyTypes
  const stateToDraftData = useCallback(
    (state: CharacterCreatorState): DraftCharacterDataType => ({
      priorityInfo: state.priorityInfo,
      heritageInfo: state.priorityHeritage,
      attributeInfo: state.attributeInfo,
      specialAttributeInfo: state.specialAttributeInfo,
      talentInfo: state.talentInfo,
      positiveQualityListSelected: state.positiveQualityListSelected,
      negativeQualityListSelected: state.negativeQualityListSelected,
      skillSelections: state.skillSelections,
      skillGroupSelections: state.skillGroupSelections,
      ...(state.martialArtSelected !== undefined && {
        martialArtSelected: state.martialArtSelected,
      }),
      equipmentSelections: state.equipmentSelections,
      lifestyleSelections: state.lifestyleSelections,
      karmaPoints: state.karmaPoints,
      nuyen: state.nuyen,
      bonusInfo: state.bonusInfo,
      currentStep: state.currentStep,
    }),
    []
  );

  // Convert server data to local state
  const draftDataToState = useCallback(
    (data: DraftCharacterDataType): CharacterCreatorState => {
      const defaultState = getDefaultState();
      return {
        ...defaultState,
        priorityInfo: data.priorityInfo ?? defaultState.priorityInfo,
        priorityHeritage: data.heritageInfo ?? defaultState.priorityHeritage,
        attributeInfo: data.attributeInfo ?? defaultState.attributeInfo,
        specialAttributeInfo:
          data.specialAttributeInfo ?? defaultState.specialAttributeInfo,
        talentInfo: data.talentInfo ?? defaultState.talentInfo,
        positiveQualityListSelected:
          data.positiveQualityListSelected ??
          defaultState.positiveQualityListSelected,
        negativeQualityListSelected:
          data.negativeQualityListSelected ??
          defaultState.negativeQualityListSelected,
        skillSelections: data.skillSelections ?? defaultState.skillSelections,
        skillGroupSelections:
          data.skillGroupSelections ?? defaultState.skillGroupSelections,
        martialArtSelected:
          data.martialArtSelected ?? defaultState.martialArtSelected,
        equipmentSelections:
          data.equipmentSelections ?? defaultState.equipmentSelections,
        lifestyleSelections:
          data.lifestyleSelections ?? defaultState.lifestyleSelections,
        karmaPoints: data.karmaPoints ?? defaultState.karmaPoints,
        nuyen: data.nuyen ?? defaultState.nuyen,
        bonusInfo: data.bonusInfo ?? defaultState.bonusInfo,
        currentStep: data.currentStep ?? defaultState.currentStep,
      };
    },
    []
  );

  // Save to localStorage
  const saveToLocalStorage = useCallback(
    (
      state: CharacterCreatorState,
      version: number,
      draftId: number | null,
      pendingSync: boolean
    ) => {
      const storageKey = draftId
        ? `${DRAFT_STORAGE_KEY_PREFIX}${draftId}`
        : SESSION_DRAFT_KEY;
      const data: LocalStorageData = {
        data: state,
        version,
        pendingSync,
        draftId,
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    []
  );

  // Load from localStorage
  const loadFromLocalStorage = useCallback(
    (draftId: number | null): LocalStorageData | null => {
      const storageKey = draftId
        ? `${DRAFT_STORAGE_KEY_PREFIX}${draftId}`
        : SESSION_DRAFT_KEY;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored) as LocalStorageData;
        }
      } catch (e) {
        console.error("Failed to load from localStorage:", e);
      }
      return null;
    },
    []
  );

  // Save to server
  const saveToServer = useCallback(
    async (
      state: CharacterCreatorState,
      currentDraftId: number | null,
      currentVersion: number
    ) => {
      // Check if changes exist since last sync
      const draftData = stateToDraftData(state);
      const draftJson = JSON.stringify(draftData);

      if (draftJson === lastSyncedJson.current) {
        return;
      }

      // Check offline status
      if (!navigator.onLine) {
        saveToLocalStorage(state, currentVersion, currentDraftId, true);
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        if (currentDraftId === null) {
          // Create new draft
          const result = await createDraftMutation.mutateAsync({
            currentStep: state.currentStep,
            characterData: draftData,
          });
          setDraftId(result.id);
          setVersion(result.version);
          // Update URL without adding to history
          navigate(`/character_creator/${result.id}`, { replace: true });

          // Update sync state
          lastSyncedJson.current = draftJson;

          // Update localStorage key
          saveToLocalStorage(state, result.version, result.id, false);
          // Remove session draft
          localStorage.removeItem(SESSION_DRAFT_KEY);
        } else {
          // Update existing draft
          const result = await updateDraftMutation.mutateAsync({
            draftId: currentDraftId,
            version: currentVersion,
            currentStep: state.currentStep,
            characterData: draftData,
          });

          if (result.conflict) {
            // Handle conflict
            setConflict({
              hasConflict: true,
              serverVersion: result.serverVersion,
              serverData: result.serverData.characterData,
            });
            saveToLocalStorage(state, currentVersion, currentDraftId, true);
          } else {
            setVersion(result.version);
            lastSyncedJson.current = draftJson;
            saveToLocalStorage(state, result.version, currentDraftId, false);
          }
        }
      } catch (e) {
        console.error("Failed to save to server:", e);
        // Do not update lastSyncedJson so retry happens on next change
        setError("Failed to save to server. Changes saved locally.");
        saveToLocalStorage(state, currentVersion, currentDraftId, true);
      } finally {
        setIsSaving(false);
      }
    },
    [
      createDraftMutation,
      updateDraftMutation,
      navigate,
      saveToLocalStorage,
      stateToDraftData,
    ]
  );

  // Listen for online event to sync pending changes
  useEffect(() => {
    const handleOnline = () => {
      // Trigger immediate sync attempt
      if (serverSaveTimer.current) clearTimeout(serverSaveTimer.current);
      saveToServer(state, draftId, version);
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [state, draftId, version, saveToServer]);

  // Initial load effect
  useEffect(() => {
    if (initialLoadDone.current) return;

    if (draftIdFromUrl !== null && !isNaN(draftIdFromUrl)) {
      // Loading from server via draftQuery
      if (draftQuery.isSuccess && draftQuery.data) {
        // Cast through unknown as server returns raw JSON that may not match strict types
        const loadedState = draftDataToState(
          draftQuery.data.characterData as unknown as DraftCharacterDataType
        );
        setStateInternal(loadedState);
        setVersion(draftQuery.data.version);
        setDraftId(draftIdFromUrl);
        setIsLoading(false);
        initialLoadDone.current = true;
        // Set last synced state
        lastSyncedJson.current = JSON.stringify(stateToDraftData(loadedState));
      } else if (draftQuery.isError) {
        // Try localStorage fallback
        const localData = loadFromLocalStorage(draftIdFromUrl);
        if (localData) {
          setStateInternal(localData.data);
          setVersion(localData.version);
          setDraftId(localData.draftId);
          setError("Loaded from local backup. Server unavailable.");
          // Set last synced state (prevent immediate re-save)
          lastSyncedJson.current = JSON.stringify(
            stateToDraftData(localData.data)
          );
        } else {
          setError("Draft not found");
        }
        setIsLoading(false);
        initialLoadDone.current = true;
      }
    } else {
      // No ID - check for session draft in localStorage
      const sessionData = loadFromLocalStorage(null);
      if (sessionData) {
        setStateInternal(sessionData.data);
        setVersion(sessionData.version);
        setDraftId(sessionData.draftId);
        lastSyncedJson.current = JSON.stringify(
          stateToDraftData(sessionData.data)
        );
      } else {
        // Default state
        lastSyncedJson.current = JSON.stringify(
          stateToDraftData(getDefaultState())
        );
      }
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  }, [
    draftIdFromUrl,
    draftQuery.isSuccess,
    draftQuery.isError,
    draftQuery.data,
    draftDataToState,
    loadFromLocalStorage,
    stateToDraftData,
  ]);

  // Public setState with debounced saves
  const setState = useCallback(
    (newState: Partial<CharacterCreatorState>) => {
      setStateInternal((prevState) => {
        const updatedState = { ...prevState, ...newState };

        // Debounced localStorage save
        if (localSaveTimer.current) {
          clearTimeout(localSaveTimer.current);
        }
        localSaveTimer.current = setTimeout(() => {
          saveToLocalStorage(updatedState, version, draftId, true);
        }, LOCAL_SAVE_DELAY);

        // Debounced server save
        if (serverSaveTimer.current) {
          clearTimeout(serverSaveTimer.current);
        }
        serverSaveTimer.current = setTimeout(() => {
          saveToServer(updatedState, draftId, version);
        }, SERVER_SAVE_DELAY);

        return updatedState;
      });
    },
    [draftId, version, saveToLocalStorage, saveToServer]
  );

  // Resolve conflict
  const resolveConflict = useCallback(
    (action: "loadServer" | "overwrite") => {
      if (!conflict.hasConflict) return;

      if (action === "loadServer" && conflict.serverData) {
        const serverState = draftDataToState(conflict.serverData);
        setStateInternal(serverState);
        setVersion(conflict.serverVersion ?? 1);
        setConflict({ hasConflict: false });
        saveToLocalStorage(
          serverState,
          conflict.serverVersion ?? 1,
          draftId,
          false
        );
      } else if (action === "overwrite" && draftId !== null) {
        // Force overwrite
        updateDraftMutation
          .mutateAsync({
            draftId,
            version: conflict.serverVersion ?? version,
            currentStep: state.currentStep,
            characterData: stateToDraftData(state),
            forceOverwrite: true,
          })
          .then((result) => {
            if (!result.conflict) {
              setVersion(result.version);
              setConflict({ hasConflict: false });
              saveToLocalStorage(state, result.version, draftId, false);
            }
          })
          .catch((err) => {
            console.error("Failed to force overwrite:", err);
            setError("Failed to overwrite. Please try again.");
          });
      }
    },
    [
      conflict,
      draftId,
      version,
      state,
      draftDataToState,
      saveToLocalStorage,
      stateToDraftData,
      updateDraftMutation,
    ]
  );

  // Delete draft
  const deleteDraft = useCallback(async () => {
    if (draftId !== null) {
      try {
        await deleteDraftMutation.mutateAsync(draftId);
      } catch (e) {
        console.error("Failed to delete draft from server:", e);
      }
      // Remove from localStorage
      localStorage.removeItem(`${DRAFT_STORAGE_KEY_PREFIX}${draftId}`);
    }
    localStorage.removeItem(SESSION_DRAFT_KEY);
    setDraftId(null);
    setStateInternal(getDefaultState());
    setVersion(1);
    navigate("/character_creator", { replace: true });
  }, [draftId, deleteDraftMutation, navigate]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (localSaveTimer.current) clearTimeout(localSaveTimer.current);
      if (serverSaveTimer.current) clearTimeout(serverSaveTimer.current);
    };
  }, []);

  return {
    state,
    setState,
    isLoading,
    isSaving,
    error,
    draftId,
    version,
    conflict,
    resolveConflict,
    deleteDraft,
  };
}
