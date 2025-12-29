import { ArwesButton } from "../../../common/ArwesButton.js";
import styles from "./EquipmentSelect.module.css";
import type { CustomisedGearLoadedType } from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";

interface GearSubListProps {
  gearList: CustomisedGearLoadedType[];
  onRemove: (gearIdx: number) => void;
  header?: string;
}

export const GearSubList = ({
  gearList,
  onRemove,
  header = "Gear",
}: GearSubListProps) => {
  if (!gearList || gearList.length === 0) {
    return null;
  }

  return (
    <div className={styles.subListContainer}>
      <span className={styles.subListHeader}>{header}:</span>
      <ul className={styles.subList}>
        {gearList.map((gear, gearIdx) => (
          <li
            key={gear.baseGear.name + gearIdx}
            className={styles.subListItemColumn}
          >
            <span className={styles.smallText}>{gear.baseGear.name}</span>
            <ArwesButton
              onClick={() => onRemove(gearIdx)}
              palette="error"
              className={styles.removeButton}
            >
              X
            </ArwesButton>
          </li>
        ))}
      </ul>
    </div>
  );
};
