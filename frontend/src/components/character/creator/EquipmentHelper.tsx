import { useState, type ReactNode } from "react";
import { Collapse } from "react-collapse";

interface IProps {
  title: string;
  children: ReactNode;
  addItem?: (() => void) | undefined;
  removeItem?: (() => void) | undefined;
}

export const CollapsibleEquipmentDiv = function (props: IProps) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const toggleIsOpened = function () {
    setIsOpened(!isOpened);
  };
  return (
    <div>
      <div onClick={() => toggleIsOpened()}>
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
};
