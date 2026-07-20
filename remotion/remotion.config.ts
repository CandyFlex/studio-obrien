import { Config } from '@remotion/cli/config';

// Sharpness: render frames as PNG (lossless) so the big 3420x1800 desktop export
// doesn't pick up JPEG artifacts before the video codec runs.
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
// High-quality h264. Lower CRF = sharper/larger. 18 is visually lossless-ish.
Config.setCrf(18);
