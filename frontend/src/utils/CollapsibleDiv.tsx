import { useState, type ReactNode } from "react";
import { Collapse } from "react-collapse";
import { ArwesButton } from "../components/common/ArwesButton.js";
import styles from "./CollapsibleDiv.module.css";

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
    <div className={styles.container}>
      <ArwesButton onClick={() => toggleIsOpened()} className={styles.button}>
        {props.title} {isOpened ? "▲" : "▼"}
      </ArwesButton>
      <Collapse isOpened={isOpened}>
        <div className={styles.content}>{props.children}</div>
      </Collapse>
    </div>
  );
};
