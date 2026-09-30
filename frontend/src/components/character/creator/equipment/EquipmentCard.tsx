import { type ReactNode } from "react";
import { ArwesButton } from "../../../common/ArwesButton.js";
import type { RequirementCompatibilityType } from "@neon-codex/common";
import styles from "./EquipmentSelect.module.css";

interface EquipmentCardProps {
  name: string;
  details: string;
  cost: string;
  onAdd: () => void;
  includes?: ReactNode;
  addButtonTitle?: string | undefined;
  compatibility?: RequirementCompatibilityType | undefined;
}

export const EquipmentCard = ({
  name,
  details,
  cost,
  onAdd,
  includes,
  addButtonTitle,
  compatibility,
}: EquipmentCardProps) => {
  const isCompatible = compatibility?.isCompatible ?? true;
  const containerClass = isCompatible
    ? styles.itemContainer
    : `${styles.itemContainer} ${styles.itemContainerIncompatible}`;

  const buttonTitle =
    !isCompatible && compatibility?.unmetReasons?.length !== undefined
      ? compatibility.unmetReasons.join("; ")
      : addButtonTitle;

  return (
    <div className={containerClass}>
      <div className={styles.itemHeader}>
        <div>
          <strong className={styles.itemName}>{name}</strong>
          <div className={styles.itemDetails}>
            {details} | Cost: {cost}
          </div>
          {includes}
          {!isCompatible && compatibility?.unmetReasons && (
            <div className={styles.incompatibleReasons}>
              <span className={styles.incompatibleBadge}>⚠️ Incompatible</span>
              {compatibility.unmetReasons.map((reason, i) => (
                <div key={i} className={styles.incompatibleReasonItem}>
                  • {reason}
                </div>
              ))}
            </div>
          )}
        </div>
        <ArwesButton
          onClick={onAdd}
          title={buttonTitle}
          disabled={!isCompatible}
          palette={isCompatible ? "primary" : "secondary"}
        >
          Add
        </ArwesButton>
      </div>
    </div>
  );
};
