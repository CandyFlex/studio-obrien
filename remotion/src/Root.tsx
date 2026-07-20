import React from 'react';
import { Composition } from 'remotion';
import { DesktopPreview } from './DesktopPreview';
import { MobilePreview } from './MobilePreview';

/**
 * Dimensions are 2x the largest on-page size so exports never pixelate:
 *   DesktopPreview 3420x1800  -> exactly 19:10  (matches .v5-screen)
 *   MobilePreview   540x1170  -> exactly 9:19.5 (matches .v5-phone-screen)
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DesktopPreview"
      component={DesktopPreview}
      durationInFrames={510}
      fps={30}
      width={3420}
      height={1800}
    />
    <Composition
      id="MobilePreview"
      component={MobilePreview}
      durationInFrames={390}
      fps={30}
      width={540}
      height={1170}
    />
  </>
);
