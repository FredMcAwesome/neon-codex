import { Animator } from "@arwes/react";
import { FrameLines } from "@arwes/react";
import type { FC, InputHTMLAttributes } from "react";

interface ArwesInputProps extends InputHTMLAttributes<HTMLInputElement> {
  palette?: string;
}

export const ArwesInput: FC<ArwesInputProps> = ({
  palette = "secondary",
  style,
  ...props
}) => {
  return (
    <Animator>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          padding: "10px",
          width: "100%",
          boxSizing: "border-box",
          marginBottom: "10px",
        }}
      >
        <FrameLines
          style={{
            // @ts-ignore
            "--arwes-frames-bg-color": `var(--arwes-palette-${palette}-main)`,
            "--arwes-frames-line-color": `var(--arwes-palette-${palette}-main)`,
            opacity: 0.3,
          }}
        />
        <input
          {...props}
          style={{
            position: "relative",
            zIndex: 1,
            background: "transparent",
            border: "none",
            color: "inherit",
            fontFamily: "inherit",
            fontSize: "inherit",
            width: "100%",
            outline: "none",
            ...style,
          }}
        />
      </div>
    </Animator>
  );
};
