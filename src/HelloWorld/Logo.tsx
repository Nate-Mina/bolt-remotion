import { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Arc } from "./Arc";
import { Atom } from "./Atom";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const myCompSchema2 = z.object({
  logoColor1: zColor(),
  logoColor2: zColor(),
});

export const Logo: React.FC<z.infer<typeof myCompSchema2>> = ({
  logoColor1: color1,
  logoColor2: color2,
}) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  // Memoize spring configurations to avoid recreating objects
  const springConfig = useMemo(() => ({
    damping: 100,
    mass: 0.5,
  }), []);

  const development = spring({
    config: springConfig,
    fps: videoConfig.fps,
    frame,
  });

  const rotationDevelopment = spring({
    config: springConfig,
    fps: videoConfig.fps,
    frame,
  });

  const scale = spring({
    frame,
    config: {
      mass: 0.5,
    },
    fps: videoConfig.fps,
  });

  // Memoize the logo rotation calculation
  const logoRotation = useMemo(() => {
    return interpolate(
      frame,
      [0, videoConfig.durationInFrames],
      [0, 360],
    );
  }, [frame, videoConfig.durationInFrames]);

  // Memoize the transform style
  const transformStyle = useMemo(() => {
    return `scale(${scale}) rotate(${logoRotation}deg)`;
  }, [scale, logoRotation]);

  return (
    <AbsoluteFill
      style={{
        transform: transformStyle,
      }}
    >
      <Arc
        rotateProgress={rotationDevelopment}
        progress={development}
        rotation={30}
        color1={color1}
        color2={color2}
      />
      <Arc
        rotateProgress={rotationDevelopment}
        rotation={90}
        progress={development}
        color1={color1}
        color2={color2}
      />
      <Arc
        rotateProgress={rotationDevelopment}
        rotation={-30}
        progress={development}
        color1={color1}
        color2={color2}
      />
      <Atom scale={rotationDevelopment} color1={color1} color2={color2} />
    </AbsoluteFill>
  );
};
