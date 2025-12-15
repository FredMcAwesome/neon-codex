import { type FC } from "react";
import { Animated, Animator } from "@arwes/react";
import { FrameLines } from "@arwes/react";

interface ArwesSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  palette?: string;
}

export const ArwesSelect: FC<ArwesSelectProps> = ({
  className,
  palette = "primary",
  style,
  children,
  ...props
}) => {
  return (
    <Animator duration={{ delay: 0 }}>
      <Animated
        style={{
          position: "relative",
          display: "inline-block",
          minWidth: "200px",
          ...style,
        }}
      >
        <FrameLines
          animated={false}
          style={{
            // @ts-ignore
            "--arwes-frames-bg-color": `rgba(var(--arwes-palette-${palette}-main-rgb), 0.1)`,
            "--arwes-frames-line-color": `var(--arwes-palette-${palette}-main)`,
          }}
        />
        <select
          className={className}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: "none",
            color: `var(--arwes-palette-${palette}-main)`,
            fontFamily: "inherit",
            fontSize: "inherit",
            cursor: "pointer",
            outline: "none",
            appearance: "none", // Hide default arrow
          }}
          {...props}
        >
          {children}
        </select>
        {/* Custom Arrow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            zIndex: 0,
            pointerEvents: "none",
            color: `var(--arwes-palette-${palette}-main)`,
            fontSize: "0.8em",
          }}
        >
          ▼
        </div>
      </Animated>
    </Animator>
  );
};
