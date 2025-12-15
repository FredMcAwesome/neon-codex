import { useState, useCallback, type ReactNode, memo } from "react";
import { Collapse } from "react-collapse";
import { ArwesButton } from "../../common/ArwesButton.js";

interface IProps {
  title: string;
  children: ReactNode;
  addItem?: (() => void) | undefined;
  removeItem?: (() => void) | undefined;
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
      style={{
        marginBottom: "10px",
        border: "1px solid var(--arwes-palette-primary-dark-3)",
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <div
        onClick={toggleIsOpened}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          cursor: "pointer",
          background: "rgba(var(--arwes-palette-primary-main-rgb), 0.1)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            color: "var(--arwes-palette-secondary-main)",
          }}
        >
          {props.title} {isOpened ? "▲" : "▼"}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
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
        <div style={{ padding: "10px" }}>{props.children}</div>
      </Collapse>
    </div>
  );
});
