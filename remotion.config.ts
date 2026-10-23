// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// WebGL para 3D (@remotion/three) y efectos. "swangle" es por software y funciona en cualquier máquina,
// incluida la nube sin GPU; en una PC con placa de video podés cambiarlo a "angle" para renderizar más rápido.
Config.setChromiumOpenGlRenderer("swangle");
