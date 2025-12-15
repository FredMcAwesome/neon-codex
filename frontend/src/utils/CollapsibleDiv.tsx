import { useState, type ReactNode } from "react";
import { Collapse } from "react-collapse";
import { ArwesButton } from "../components/common/ArwesButton.js";

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
    <div style={{ marginBottom: "10px" }}>
      <ArwesButton
        onClick={() => toggleIsOpened()}
        style={{ width: "100%", textAlign: "left" }}
      >
        {props.title} {isOpened ? "▲" : "▼"}
      </ArwesButton>
      <Collapse isOpened={isOpened}>
        <div
          style={{
            padding: "10px",
            border: "1px solid var(--arwes-palette-primary-dark-2)",
            borderTop: "none",
          }}
        >
          {props.children}
        </div>
      </Collapse>
    </div>
  );
};
