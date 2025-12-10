import { useState, useCallback, type ReactNode, memo } from "react";
import { Collapse } from "react-collapse";

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
    <div>
      <div onClick={toggleIsOpened}>
        <div>{props.title}</div>
        <div>
          {props.addItem !== undefined && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                props.addItem!();
              }}
            >
              Add
            </button>
          )}
          {props.removeItem !== undefined && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                props.removeItem!();
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <Collapse isOpened={isOpened}>{props.children}</Collapse>
    </div>
  );
});
