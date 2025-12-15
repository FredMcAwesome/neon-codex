import { type FC, type ReactNode } from "react";
import { Animator } from "@arwes/react";
import { FrameCorners } from "@arwes/react";
import { Text } from "@arwes/react";

interface ArwesButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  palette?: "primary" | "secondary" | "error" | "success" | "warning";
  style?: React.CSSProperties;
}

export const ArwesButton: FC<
  ArwesButtonProps & { type?: "button" | "submit" | "reset" }
> = ({
  children,
  onClick,
  disabled = false,
  className,
  palette = "primary",
  type = "button",
  style,
}) => {
  return (
    <Animator disabled={disabled}>
      <button
        className={className}
        onClick={onClick}
        type={type}
        style={{
          position: "relative",
          display: "inline-block",
          padding: "0px 20px",
          cursor: "pointer",
          userSelect: "none",
          background: "transparent",
          border: "none",
          color: "inherit",
          fontFamily: "inherit",
          fontSize: "inherit",
          ...style,
        }}
      >
        <FrameCorners
          style={{
            // @ts-ignore
            "--arwes-frames-bg-color": `rgba(var(--arwes-palette-${palette}-main-rgb), 0.2)`,
            "--arwes-frames-line-color": `var(--arwes-palette-${palette}-main)`,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textShadow: `0 0 2px var(--arwes-palette-${palette}-main)`,
          }}
        >
          <Text>{children}</Text>
        </div>
      </button>
    </Animator>
  );
};
