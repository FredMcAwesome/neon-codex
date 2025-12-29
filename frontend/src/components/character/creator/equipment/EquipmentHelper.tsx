import { useState, useCallback, type ReactNode, memo } from "react";
import { Collapse } from "react-collapse";
import { ArwesButton } from "../../../common/ArwesButton.js";
import styles from "./EquipmentHelper.module.css";

interface IProps {
  title: string;
  children: ReactNode;
  addItem?: (() => void) | undefined;
  removeItem?: (() => void) | undefined;
  style?: React.CSSProperties;
  className?: string;
}

// Memoized component to prevent unnecessary re-renders
export const CollapsibleEquipmentDiv = memo(function CollapsibleEquipmentDiv(
  props: IProps
) {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  // Memoized toggle handler
  const toggleIsOpened = useCallback(function () {
    setIsOpened((prev) => !prev);
  }, []);

  return (
    <div
      className={`${styles.collapsibleContainer} ${props.className || ""}`}
      style={props.style}
    >
      <div className={styles.header} onClick={toggleIsOpened}>
        <div className={styles.headerTitle}>
          {props.title} {isOpened ? "▲" : "▼"}
        </div>
        <div className={styles.buttonGroup}>
          {props.addItem !== undefined && (
            <ArwesButton
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                props.addItem!();
              }}
            >
              Add
            </ArwesButton>
          )}
          {props.removeItem !== undefined && (
            <ArwesButton
              palette="error"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                props.removeItem!();
              }}
            >
              Remove
            </ArwesButton>
          )}
        </div>
      </div>
      <Collapse isOpened={isOpened}>
        <div className={styles.content}>{props.children}</div>
      </Collapse>
    </div>
  );
});
