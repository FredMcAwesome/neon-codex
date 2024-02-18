import { useState, type ReactNode } from "react";
import { Collapse } from "react-collapse";

interface IProps {
  title: string;
  children: ReactNode;
}

export const CollapsibleDiv = function (props: IProps) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const toggleIsOpened = function () {
    setIsOpened(!isOpened);
  };
  return (
    <div>
      <div onClick={() => toggleIsOpened()}>{props.title}</div>
      <Collapse isOpened={isOpened}>{props.children}</Collapse>
    </div>
  );
};
