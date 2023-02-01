import { useState } from "react";
import { Collapse } from "react-collapse";

interface IProps {
  title: string;
  children: React.ReactNode;
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
