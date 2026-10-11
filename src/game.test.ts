import { createCanvas } from "@napi-rs/canvas";
import { createEngine, ConstantClock } from "@clockwyrks/simple-2d";
import { afterEach, describe, expect, it } from "vitest";
import { game, type CaromState } from "./game";

const engines: ReturnType<typeof createEngine<CaromState>>[] = [];
async function setup() {
  const canvas = createCanvas(1280, 720) as unknown as HTMLCanvasElement;
  const events = new EventTarget();
  const engine = createEngine({
    canvas,
    width: 1280,
    height: 720,
    game,
    clock: new ConstantClock(10),
    surface: {
      cssWidth: () => 1280,
      cssHeight: () => 720,
      dpr: () => 1,
      events: () => events,
    },
  });
  engines.push(engine);
  await engine.initialize();
  return engine;
}
afterEach(() => {
  for (const engine of engines.splice(0)) engine.destroy();
});

describe("Carom simulation", () => {
  it("starts complete and moves the left paddle by elapsed time", async () => {
    const engine = await setup();
    expect(engine.debug.snapshot(engine.state).screen).toBe("title");
    engine.apply((s) => engine.debug.setScreen(s, "countdown"));
    engine.apply((s) => engine.debug.setBallHoldTimer(s, 100));
    engine.apply((s) => engine.debug.setPaddleDriven(s, "left", true));
    engine.apply((s) => engine.debug.setPaddleVy(s, "left", 100));
    await engine.advance(10);
    expect(engine.debug.snapshot(engine.state).paddles.left.cy).toBeCloseTo(
      370,
    );
  });
  it("serves after the hold and scores a ball crossing the far goal", async () => {
    const engine = await setup();
    engine.apply((s) => engine.debug.setScreen(s, "countdown"));
    engine.apply((s) => engine.debug.setBallHoldTimer(s, 0.01));
    await engine.advance(2);
    expect(engine.debug.snapshot(engine.state).ball?.held).toBe(false);
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    engine.apply((s) => engine.debug.setAiMovement(s, false));
    engine.apply((s) => engine.debug.setPaddleCy(s, "right", 55));
    engine.apply((s) => engine.debug.setBallPosition(s, 1270, 360));
    engine.apply((s) => engine.debug.setBallVelocity(s, 980, 0));
    await engine.advance(4);
    expect(engine.debug.snapshot(engine.state).score.p1).toBe(1);
    expect(engine.debug.snapshot(engine.state).screen).toBe("countdown");
  });
  it("poses, clears, and reports the world without mutating prior state", async () => {
    const engine = await setup();
    const before = engine.state;
    engine.apply((s) => engine.debug.setBallSpin(s, 320));
    expect(engine.debug.snapshot(before).ball?.spin).toBe(0);
    engine.apply((s) => engine.debug.clearWorld(s));
    expect(engine.debug.snapshot(engine.state).ball).toBeNull();
    expect(engine.debug.snapshot(engine.state).obstacles).toHaveLength(0);
  });
});
