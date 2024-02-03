import { useState } from "react";
import { Collapse } from "react-collapse";

interface IProps {
  title: string;
  children: React.ReactNode;
  addItem: () => void;
  removeItem?: () => void;
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
          <button
            onClick={(event) => {
              event.stopPropagation();
              props.addItem();
            }}
          >
            Add
          </button>
          {props.removeItem && (
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
