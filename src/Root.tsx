import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { H30Franquicia, H30_DURATION } from "./h30/H30Franquicia";
import { H30Reel, H30_REEL_DURATION } from "./h30/reel/H30Reel";
import { PausaPromo, PAUSA_DURATION } from "./promo/PausaPromo";
import { KeynoteDemo, KEYNOTE_DURATION } from "./promo/KeynoteDemo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Motion">
        <Composition
          id="PausaPromo"
          component={PausaPromo}
          durationInFrames={PAUSA_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KeynoteDemo"
          component={KeynoteDemo}
          durationInFrames={KEYNOTE_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="H30Reel"
        component={H30Reel}
        durationInFrames={H30_REEL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="H30Franquicia"
        component={H30Franquicia}
        durationInFrames={H30_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
