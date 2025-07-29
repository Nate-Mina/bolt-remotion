import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "./constants";

const title: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontWeight: "bold",
  fontSize: 100,
  textAlign: "center",
  position: "absolute",
  bottom: 160,
  width: "100%",
};

const word: React.CSSProperties = {
  marginLeft: 10,
  marginRight: 10,
  display: "inline-block",
};

export const Title: React.FC<{
  titleText: string;
  titleColor: string;
}> = ({ titleText, titleColor }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  // Memoize word splitting to avoid recalculation
  const words = useMemo(() => titleText.split(" "), [titleText]);

  // Memoize spring configuration
  const springConfig = useMemo(() => ({
    damping: 200,
  }), []);

  return (
    <h1 style={title}>
      {words.map((t, i) => {
        const delay = i * 5;

        const scale = spring({
          fps: videoConfig.fps,
          frame: frame - delay,
          config: springConfig,
        });

        return (
          <span
            key={t}
            style={{
              ...word,
              color: titleColor,
              transform: `scale(${scale})`,
            }}
          >
            {t}
          </span>
        );
      })}
    </h1>
  );
};
