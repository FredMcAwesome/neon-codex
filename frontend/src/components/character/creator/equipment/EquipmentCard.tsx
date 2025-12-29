import { type ReactNode } from "react";
import { ArwesButton } from "../../../common/ArwesButton.js";
import styles from "./EquipmentSelect.module.css";

interface EquipmentCardProps {
  name: string;
  details: string;
  cost: string;
  onAdd: () => void;
  includes?: ReactNode;
  addButtonTitle?: string | undefined;
}

export const EquipmentCard = ({
  name,
  details,
  cost,
  onAdd,
  includes,
  addButtonTitle,
}: EquipmentCardProps) => {
  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemHeader}>
        <div>
          <strong className={styles.itemName}>{name}</strong>
          <div className={styles.itemDetails}>
            {details} | Cost: {cost}
          </div>
          {includes}
        </div>
        <ArwesButton onClick={onAdd} title={addButtonTitle}>
          Add
        </ArwesButton>
      </div>
    </div>
  );
};
