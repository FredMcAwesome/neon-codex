import { type FC, type ReactNode } from "react";
import { Animator } from "@arwes/react";
import { FrameOctagon } from "@arwes/react";

interface ArwesCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  palette?: string;
}

export const ArwesCard: FC<ArwesCardProps> = ({
  children,
  className,
  title,
  palette = "primary",
}) => {
  return (
    <Animator>
      <div
        className={className}
        style={{
          position: "relative",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <FrameOctagon
          style={{
            // @ts-ignore
            "--arwes-frames-bg-color": `var(--arwes-palette-${palette}-main)`,
            "--arwes-frames-line-color": `var(--arwes-palette-${palette}-main)`,
            opacity: 0.5,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {title != null && <h3 style={{ marginTop: 0 }}>{title}</h3>}
          {children}
        </div>
      </div>
    </Animator>
  );
};
