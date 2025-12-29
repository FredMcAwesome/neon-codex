import { type ReactNode } from "react";
import { ArwesButton } from "../../../common/ArwesButton.js";
import styles from "./EquipmentSelect.module.css";

interface BaseMod {
  name: string;
}

interface ModSubListProps<T extends { baseMod: BaseMod }> {
  modList: T[];
  onRemove: (modIdx: number) => void;
  header?: string;
  renderModContent?: (mod: T, modIdx: number) => ReactNode;
}

export const ModSubList = <T extends { baseMod: BaseMod }>({
  modList,
  onRemove,
  header = "Modifications",
  renderModContent,
}: ModSubListProps<T>) => {
  if (!modList || modList.length === 0) {
    return null;
  }

  return (
    <div className={styles.subListContainer}>
      <span className={styles.subListHeader}>{header}:</span>
      <ul className={styles.subList}>
        {modList.map((mod, modIdx) => (
          <li
            key={mod.baseMod.name + modIdx}
            className={styles.subListItemColumn}
          >
            <div className={styles.flexRow}>
              <span className={styles.smallText}>{mod.baseMod.name}</span>
              <ArwesButton
                onClick={() => onRemove(modIdx)}
                palette="error"
                className={styles.removeButton}
              >
                X
              </ArwesButton>
            </div>
            {renderModContent && renderModContent(mod, modIdx)}
          </li>
        ))}
      </ul>
    </div>
  );
};
