import { Composition, Folder } from "remotion";
import { ArcadeWalkthrough } from "./ArcadeWalkthrough";
import { PitchV1, PitchV2, PitchV3, PitchV4, PitchV5 } from "./PitchSlides";
import "./fonts.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ArcadeWalkthrough"
        component={ArcadeWalkthrough}
        durationInFrames={745}
        fps={30}
        width={1920}
        height={1080}
      />

      <Folder name="PitchSlides">
        <Composition id="Pitch-V1-GoogleProblem" component={PitchV1} durationInFrames={1} fps={30} width={1920} height={1080} />
        <Composition id="Pitch-V2-CustomerJourney" component={PitchV2} durationInFrames={1} fps={30} width={1920} height={1080} />
        <Composition id="Pitch-V3-WithVsWithout" component={PitchV3} durationInFrames={1} fps={30} width={1920} height={1080} />
        <Composition id="Pitch-V4-CostOfNotHaving" component={PitchV4} durationInFrames={1} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
