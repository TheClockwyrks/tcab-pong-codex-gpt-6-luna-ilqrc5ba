import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_W,
  OBSTACLES,
  PADDLE_H,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  SPEED_CAP,
  SPEED_MULT,
  TITLE_ITEMS,
  TITLE_TEXT,
  PAUSE_ITEMS,
  MATCHOVER_ITEMS,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";
export type Mode = "solo" | "versus";
export type Side = "left" | "right";
export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}
export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}
export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}
export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}
export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}
export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
  readonly muted: boolean;
}
export interface Snapshot {
  version: number;
  screen: Screen;
  mode: Mode;
  menuIndex: number;
  titleIndex: number;
  resumeScreen: "countdown" | "playing";
  score: { p1: number; p2: number };
  winner: Side | null;
  muted: boolean;
  paddles: {
    left: { cy: number; vy: number; drivenVy: number; driven: boolean };
    right: { cy: number; vy: number; drivenVy: number; driven: boolean };
  };
  ai: { tracking: boolean; movement: boolean };
  receiver: Side;
  ball: null | {
    x: number;
    y: number;
    vx: number;
    vy: number;
    speed: number;
    spin: number;
    held: boolean;
    holdTimer: number;
    serveSign: 1 | -1;
    trail: readonly TrailSample[];
  };
  obstacles: readonly ObstacleState[];
  simTime: number;
}
export interface CaromDebugApi {
  readonly version: number;
  clearWorld(s: DeepReadonly<CaromState>): CaromState;
  spawnBall(s: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(s: DeepReadonly<CaromState>, index: number): CaromState;
  reset(s: DeepReadonly<CaromState>): CaromState;
  reconcile(s: DeepReadonly<CaromState>): CaromState;
  setScreen(s: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(s: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(s: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(s: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    s: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(s: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(s: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(s: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(s: DeepReadonly<CaromState>, side: Side, cy: number): CaromState;
  setPaddleVy(s: DeepReadonly<CaromState>, side: Side, vy: number): CaromState;
  setPaddleDriven(
    s: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    s: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    s: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(s: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(s: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(s: DeepReadonly<CaromState>, seconds: number): CaromState;
  setBallServeSign(s: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(s: DeepReadonly<CaromState>): CaromState;
  setAiTracking(s: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(s: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(s: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(s: DeepReadonly<CaromState>): Snapshot;
  menuItemRect(
    s: DeepReadonly<CaromState>,
    index: number,
  ): { x: number; y: number; w: number; h: number } | null;
}
export const BACKGROUND = "#080d18";
const COLORS = {
  ink: "#080d18",
  panel: "#101a2c",
  line: "#26354c",
  text: "#e7f2ff",
  muted: "#8394ab",
  cyan: "#55e6d0",
  coral: "#ff758f",
  gold: "#ffc66d",
  obstacle: "#66768f",
};
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const randomSign = (): 1 | -1 => (Math.random() < 0.5 ? -1 : 1);
const initial = (muted = false): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: 0,
  titleIndex: 0,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: {
    left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
  },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: randomSign(),
    trail: [],
  },
  obstacles: OBSTACLE_CENTERS.map((p, index) => ({ index, cx: p.x, cy: p.y })),
  simTime: 0,
  muted,
});
const park = (sign = randomSign()): BallState => ({
  x: FIELD_CX,
  y: FIELD_CY,
  vx: 0,
  vy: 0,
  spin: 0,
  held: true,
  holdTimer: HOLD_TIME,
  serveSign: sign,
  trail: [],
});
const itemCount = (s: DeepReadonly<CaromState>) =>
  s.screen === "title"
    ? TITLE_ITEMS.length
    : s.screen === "howto"
      ? 1
      : s.screen === "paused"
        ? PAUSE_ITEMS.length
        : s.screen === "matchover"
          ? MATCHOVER_ITEMS.length
          : 0;
const rect = (i: number) => ({ x: 470, y: 430 + i * 64, w: 340, h: 52 });
function makeDebug(): CaromDebugApi {
  const needBall = (s: DeepReadonly<CaromState>) => {
    if (!s.ball) throw new Error("Carom debug: no ball is present");
    return s.ball;
  };
  const poseBall = (
    s: DeepReadonly<CaromState>,
    f: (b: BallState) => BallState,
  ): CaromState => ({ ...s, ball: f(needBall(s)) });
  const debug: CaromDebugApi = {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (s) => ({ ...s, ball: null, obstacles: [] }),
    spawnBall: (s) => ({ ...s, ball: park() }),
    spawnObstacle: (s, index) => {
      if (index !== 0 && index !== 1)
        throw new RangeError(`unknown obstacle ${index}`);
      return {
        ...s,
        obstacles: [
          ...s.obstacles.filter((o) => o.index !== index),
          {
            index,
            cx: OBSTACLE_CENTERS[index]!.x,
            cy: OBSTACLE_CENTERS[index]!.y,
          },
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (s) => ({
      ...initial(s.muted),
      titleIndex: s.titleIndex,
      simTime: s.simTime,
      menuIndex: s.titleIndex,
    }),
    reconcile: (s) => ({ ...s }),
    setScreen: (s, screen) => ({ ...s, screen }),
    setMode: (s, mode) => ({ ...s, mode }),
    setMenuIndex: (s, menuIndex) => ({ ...s, menuIndex }),
    setTitleIndex: (s, titleIndex) => ({ ...s, titleIndex }),
    setResumeScreen: (s, resumeScreen) => ({ ...s, resumeScreen }),
    setScore: (s, p1, p2) => ({ ...s, score: { p1, p2 } }),
    setWinner: (s, winner) => ({ ...s, winner }),
    setReceiver: (s, receiver) => ({ ...s, receiver }),
    setPaddleCy: (s, side, cy) => ({
      ...s,
      paddles: { ...s.paddles, [side]: { ...s.paddles[side], cy } },
    }),
    setPaddleVy: (s, side, drivenVy) => ({
      ...s,
      paddles: { ...s.paddles, [side]: { ...s.paddles[side], drivenVy } },
    }),
    setPaddleDriven: (s, side, driven) => ({
      ...s,
      paddles: { ...s.paddles, [side]: { ...s.paddles[side], driven } },
    }),
    setBallPosition: (s, x, y) => poseBall(s, (b) => ({ ...b, x, y })),
    setBallVelocity: (s, vx, vy) => poseBall(s, (b) => ({ ...b, vx, vy })),
    setBallSpin: (s, spin) => poseBall(s, (b) => ({ ...b, spin })),
    setBallHeld: (s, held) => poseBall(s, (b) => ({ ...b, held })),
    setBallHoldTimer: (s, holdTimer) =>
      poseBall(s, (b) => ({ ...b, holdTimer })),
    setBallServeSign: (s, serveSign) =>
      poseBall(s, (b) => ({ ...b, serveSign })),
    drawBallServeSign: (s) =>
      poseBall(s, (b) => ({ ...b, serveSign: randomSign() })),
    setAiTracking: (s, tracking) => ({ ...s, ai: { ...s.ai, tracking } }),
    setAiMovement: (s, movement) => ({ ...s, ai: { ...s.ai, movement } }),
    setMuted: (s, muted) => ({ ...s, muted }),
    snapshot(s) {
      const b = s.ball;
      return {
        version: CAROM_DEBUG_VERSION,
        screen: s.screen,
        mode: s.mode,
        menuIndex: s.menuIndex,
        titleIndex: s.titleIndex,
        resumeScreen: s.resumeScreen,
        score: { ...s.score },
        winner: s.winner,
        muted: s.muted,
        paddles: { left: { ...s.paddles.left }, right: { ...s.paddles.right } },
        ai: { ...s.ai },
        receiver: s.receiver,
        ball: b
          ? {
              ...b,
              speed: Math.hypot(b.vx, b.vy),
              trail: b.trail.map((p) => ({ ...p })),
            }
          : null,
        obstacles: s.obstacles.map((o) => ({ ...o })),
        simTime: s.simTime,
      };
    },
    menuItemRect: (s, index) =>
      index >= 0 && index < itemCount(s) ? rect(index) : null,
  };
  return debug;
}
function integratePaddle(
  p: PaddleState,
  requested: number,
  dt: number,
): PaddleState {
  const raw = p.cy + requested * dt,
    cy = clamp(raw, PADDLE_MIN_CY, PADDLE_MAX_CY);
  return { ...p, cy, vy: dt > 0 && cy !== raw ? (cy - p.cy) / dt : requested };
}
function startMatch(s: DeepReadonly<CaromState>, mode = s.mode): CaromState {
  return {
    ...s,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: park(),
    paddles: {
      left: { ...s.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...s.paddles.right, cy: FIELD_CY, vy: 0 },
    },
  };
}
function home(s: DeepReadonly<CaromState>): CaromState {
  const keep = { simTime: s.simTime, muted: s.muted, titleIndex: s.titleIndex };
  return { ...initial(s.muted), ...keep, menuIndex: s.titleIndex };
}
function menuAction(
  s: DeepReadonly<CaromState>,
  index = s.menuIndex,
): CaromState {
  if (s.screen === "title") {
    if (index === 0) return startMatch(s, "solo");
    if (index === 1) return startMatch(s, "versus");
    return { ...s, screen: "howto", menuIndex: 0 };
  }
  if (s.screen === "howto") return home(s);
  if (s.screen === "paused") {
    if (index === 0) return { ...s, screen: s.resumeScreen };
    if (index === 1) return startMatch(s);
    return home(s);
  }
  if (s.screen === "matchover") {
    if (index === 0) return startMatch(s);
    return home(s);
  }
  return { ...s };
}
function menuRects(screen: Screen) {
  return (
    screen === "title" ||
    screen === "howto" ||
    screen === "paused" ||
    screen === "matchover"
  );
}
function physics(state: CaromState, dt: number, api: UpdateApi): CaromState {
  let s = state;
  const left = s.paddles.left,
    right = s.paddles.right;
  const move = (side: Side, p: PaddleState) => {
    if (p.driven) return integratePaddle(p, p.drivenVy, dt);
    if (side === "right" && s.mode === "solo") {
      if (!s.ai.movement) return { ...p, vy: 0 };
      let target = AI_HOME_Y,
        dead = AI_HOME_DEADZONE;
      const b = s.ball;
      if (s.ai.tracking && s.screen === "playing" && b && b.vx > 0) {
        target = b.y - b.vy * AI_REACT;
        dead = AI_DEADZONE;
      }
      const diff = target - p.cy;
      const v =
        Math.abs(diff) <= dead
          ? 0
          : Math.sign(diff) *
            Math.min(AI_SPEED, dt > 0 ? Math.abs(diff) / dt : AI_SPEED);
      return integratePaddle(p, v, dt);
    }
    const up =
      side === "left"
        ? s.mode === "solo"
          ? Math.max(api.input.value("p1-up"), api.input.value("p2-up"))
          : api.input.value("p1-up")
        : api.input.value("p2-up");
    const down =
      side === "left"
        ? s.mode === "solo"
          ? Math.max(api.input.value("p1-down"), api.input.value("p2-down"))
          : api.input.value("p1-down")
        : api.input.value("p2-down");
    return integratePaddle(p, (down - up) * PADDLE_SPEED, dt);
  };
  s = {
    ...s,
    paddles: { left: move("left", left), right: move("right", right) },
  };
  if (s.screen === "countdown" && s.ball) {
    let b = { ...s.ball, holdTimer: s.ball.holdTimer - dt };
    if (b.holdTimer <= 0) {
      const dir = s.receiver === "left" ? -1 : 1;
      b = {
        ...b,
        held: false,
        holdTimer: 0,
        vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
        vy: b.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
        trail: [],
      };
      s = { ...s, screen: "playing" };
    }
    b = {
      ...b,
      trail: [...b.trail, { x: b.x, y: b.y, t: s.simTime }].filter(
        (sample) => s.simTime - sample.t <= TRAIL_TIME,
      ),
    };
    s = { ...s, ball: b };
    return s;
  }
  if (s.screen !== "playing" || !s.ball) return s;
  let b = { ...s.ball };
  if (b.held) return s;
  const speed = Math.hypot(b.vx, b.vy),
    n = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP)),
    h = dt / n;
  let wall = false,
    paddle = false,
    obstacle = false;
  for (let step = 0; step < n; step++) {
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > 0) {
      const a = (b.spin / sp) * h,
        c = Math.cos(a),
        sn = Math.sin(a);
      [b.vx, b.vy] = [b.vx * c - b.vy * sn, b.vx * sn + b.vy * c];
    }
    b.spin *= Math.pow(0.5, h / SPIN_HALFLIFE);
    b.x += b.vx * h;
    b.y += b.vy * h;
    if (b.y - BALL_R < 0 && b.vy < 0) {
      b = { ...b, y: BALL_R, vy: -b.vy };
      wall = true;
    } else if (b.y + BALL_R > FIELD_H && b.vy > 0) {
      b = { ...b, y: FIELD_H - BALL_R, vy: -b.vy };
      wall = true;
    }
    for (const side of ["left", "right"] as const) {
      const p = s.paddles[side],
        x0 = side === "left" ? P1_X0 : P2_X0,
        x1 = side === "left" ? P1_X1 : P2_X1;
      const hit = resolveRect(
        b,
        x0,
        x1,
        p.cy - PADDLE_HALF,
        p.cy + PADDLE_HALF,
      );
      if (hit) {
        b = hit.ball;
        const face = hit.face;
        if (face === "left" || face === "right") {
          const speed2 = Math.min(
              Math.hypot(b.vx, b.vy) * SPEED_MULT,
              SPEED_CAP,
            ),
            off = clamp((b.y - p.cy) / PADDLE_HALF, -1, 1),
            theta = off * MAX_BOUNCE_ANGLE,
            dir = side === "left" ? 1 : -1;
          b = {
            ...b,
            x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
            vx: dir * speed2 * Math.cos(theta),
            vy: speed2 * Math.sin(theta),
            spin: clamp(
              b.spin + p.vy * SPIN_FROM_PADDLE,
              -SPIN_CLAMP,
              SPIN_CLAMP,
            ),
          };
          paddle = true;
        } else {
          b = { ...b, vy: -b.vy };
          wall = true;
        }
      }
    }
    for (const o of s.obstacles) {
      const r = OBSTACLES[o.index]!;
      const hit = resolveRect(b, r.x0, r.x1, r.y0, r.y1);
      if (hit) {
        b = hit.ball;
        if (hit.face === "left" || hit.face === "right")
          b = { ...b, vx: -b.vx };
        else b = { ...b, vy: -b.vy };
        obstacle = true;
      }
    }
  }
  if (paddle) api.audio.play(CUES.paddleHit);
  if (wall) api.audio.play(CUES.wallBounce);
  if (obstacle) api.audio.play(CUES.obstacleBounce);
  b = {
    ...b,
    trail: [...b.trail, { x: b.x, y: b.y, t: s.simTime + dt }].filter(
      (p) => s.simTime + dt - p.t <= TRAIL_TIME,
    ),
  };
  if (b.x - BALL_R > FIELD_W || b.x + BALL_R < 0) {
    api.audio.play(CUES.score);
    const p1 = s.score.p1 + (b.x - BALL_R > FIELD_W ? 1 : 0),
      p2 = s.score.p2 + (b.x + BALL_R < 0 ? 1 : 0),
      scorer: Side = p1 > s.score.p1 ? "left" : "right";
    if (
      (p1 >= WIN_SCORE && p1 - p2 >= WIN_LEAD) ||
      (p2 >= WIN_SCORE && p2 - p1 >= WIN_LEAD)
    )
      return {
        ...s,
        ball: b,
        score: { p1, p2 },
        winner: scorer,
        screen: "matchover",
        menuIndex: 0,
      };
    return {
      ...s,
      ball: park(),
      score: { p1, p2 },
      receiver: scorer === "left" ? "right" : "left",
      screen: "countdown",
    };
  }
  return { ...s, ball: b };
}
type Face = "left" | "right" | "top" | "bottom";
function resolveRect(
  b: BallState,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): { ball: BallState; face: Face } | null {
  const l = x0 - BALL_R,
    r = x1 + BALL_R,
    t = y0 - BALL_R,
    bt = y1 + BALL_R;
  if (!(b.x > l && b.x < r && b.y > t && b.y < bt)) return null;
  const d = [b.x - l, r - b.x, b.y - t, bt - b.y],
    m = Math.min(...d),
    i = d.indexOf(m),
    face = (["left", "right", "top", "bottom"] as const)[i]!;
  if (face === "left") b = { ...b, x: l };
  else if (face === "right") b = { ...b, x: r };
  else if (face === "top") b = { ...b, y: t };
  else b = { ...b, y: bt };
  const into =
    face === "left"
      ? b.vx > 0
      : face === "right"
        ? b.vx < 0
        : face === "top"
          ? b.vy > 0
          : b.vy < 0;
  if (into)
    b =
      face === "left" || face === "right"
        ? { ...b, vx: -b.vx }
        : { ...b, vy: -b.vy };
  return { ball: b, face };
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const name of ACTIONS)
      api.input.register(name, { keys: [...BINDINGS[name]] });
    api.audio.define(CUES.paddleHit, {
      wave: "triangle",
      freq: 520,
      freqTo: 260,
      durationMs: 70,
      gain: 0.22,
    });
    api.audio.define(CUES.wallBounce, {
      wave: "sine",
      freq: 360,
      freqTo: 220,
      durationMs: 55,
      gain: 0.15,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "square",
      freq: 260,
      freqTo: 180,
      durationMs: 75,
      gain: 0.13,
    });
    api.audio.define(CUES.score, {
      wave: "triangle",
      freq: 660,
      freqTo: 990,
      durationMs: 220,
      gain: 0.25,
    });
    api.diagnostics.register("screen", (s) => s.screen);
    api.diagnostics.register("mode", (s) => s.mode);
    api.diagnostics.register("score", (s) => `${s.score.p1} : ${s.score.p2}`);
    api.diagnostics.register("ball", (s) =>
      s.ball ? `${s.ball.x.toFixed(1)}, ${s.ball.y.toFixed(1)}` : "-",
    );
    api.diagnostics.register("velocity", (s) =>
      s.ball ? `${s.ball.vx.toFixed(1)}, ${s.ball.vy.toFixed(1)}` : "-",
    );
    api.diagnostics.register("speed", (s) =>
      s.ball ? Math.hypot(s.ball.vx, s.ball.vy) : 0,
    );
    api.diagnostics.register("spin", (s) => s.ball?.spin ?? 0);
    api.diagnostics.register(
      "p1",
      (s) =>
        `${s.paddles.left.cy.toFixed(1)} / ${s.paddles.left.vy.toFixed(1)}`,
    );
    api.diagnostics.register(
      "p2",
      (s) =>
        `${s.paddles.right.cy.toFixed(1)} / ${s.paddles.right.vy.toFixed(1)}`,
    );
    return [initial(false), makeDebug()];
  },
  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    let s: CaromState = {
      ...state,
      simTime: state.simTime + dt,
      score: { ...state.score },
      paddles: {
        left: { ...state.paddles.left },
        right: { ...state.paddles.right },
      },
      ai: { ...state.ai },
      obstacles: state.obstacles.map((o) => ({ ...o })),
      ball: state.ball
        ? { ...state.ball, trail: state.ball.trail.map((p) => ({ ...p })) }
        : null,
    };
    if (api.input.pressed("mute")) {
      api.audio.setMuted(!api.audio.muted());
    }
    s = { ...s, muted: api.audio.muted() };
    const began = state.screen;
    const p1Up = api.input.pressed("p1-up");
    const p2Up = api.input.pressed("p2-up");
    const p1Down = api.input.pressed("p1-down");
    const p2Down = api.input.pressed("p2-down");
    const up = p1Up || p2Up;
    const down = p1Down || p2Down;
    const confirm = api.input.pressed("confirm"),
      back = api.input.pressed("back"),
      pause = api.input.pressed("pause");
    let pointerConfirm = false;
    if (menuRects(began)) {
      const samples = api.input.pointerSamples();
      let hover = -1,
        downIndex = -1;
      for (const sample of samples) {
        const i =
          Array.from({ length: itemCount(s) }, (_, n) => n).find((n) => {
            const r = rect(n);
            return (
              sample.x >= r.x &&
              sample.x <= r.x + r.w &&
              sample.y >= r.y &&
              sample.y <= r.y + r.h
            );
          }) ?? -1;
        if (sample.type === "move" || sample.type === "down") hover = i;
        if (sample.type === "down") downIndex = i;
        if (sample.type === "up" && i >= 0 && downIndex === i) {
          hover = i;
          pointerConfirm = true;
        }
        if (sample.type === "up") downIndex = -1;
      }
      const contacts = api.input.pointerContacts();
      for (const c of contacts) {
        const i =
          Array.from({ length: itemCount(s) }, (_, n) => n).find((n) => {
            const r = rect(n);
            return (
              c.x >= r.x && c.x <= r.x + r.w && c.y >= r.y && c.y <= r.y + r.h
            );
          }) ?? -1;
        if (i >= 0) hover = i;
      }
      if (hover >= 0) s = { ...s, menuIndex: hover };
    }
    if (began === "title" || began === "paused" || began === "matchover") {
      if (began === "paused" && (pause || back)) {
        s = { ...s, screen: s.resumeScreen };
      } else if (began === "matchover" && back) s = home(s);
      else if (up || down) {
        const count = itemCount(s),
          delta = up ? -1 : 1;
        s = { ...s, menuIndex: (s.menuIndex + delta + count) % count };
      } else if (confirm || pointerConfirm) {
        const selected = s.menuIndex;
        if (began === "title") s = { ...s, titleIndex: selected };
        s = menuAction(s, selected);
      } else if (began === "paused" && pause)
        s = { ...s, screen: s.resumeScreen };
    } else if (began === "howto" && (confirm || back || pointerConfirm))
      s = home(s);
    else if ((began === "playing" || began === "countdown") && pause) {
      s = { ...s, resumeScreen: began, screen: "paused", menuIndex: 0 };
    }
    if (s.screen === "countdown" || s.screen === "playing")
      s = physics(s, dt, api);
    return s;
  },
  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const c = api.ctx;
    c.fillStyle = COLORS.ink;
    c.fillRect(0, 0, FIELD_W, FIELD_H);
    const field = (dim = false) => {
      c.save();
      if (dim) c.globalAlpha = 0.3;
      c.strokeStyle = COLORS.line;
      c.lineWidth = 2;
      c.strokeRect(26, 26, FIELD_W - 52, FIELD_H - 52);
      c.setLineDash([13, 15]);
      c.strokeStyle = "#31415a";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(FIELD_CX, 50);
      c.lineTo(FIELD_CX, FIELD_H - 50);
      c.stroke();
      c.setLineDash([]);
      for (const o of state.obstacles) {
        rounded(
          c,
          o.cx - OBSTACLE_W / 2,
          o.cy - OBSTACLE_H / 2,
          OBSTACLE_W,
          OBSTACLE_H,
          10,
          COLORS.obstacle,
        );
      }
      drawPaddle(c, P1_X0, state.paddles.left.cy, COLORS.cyan);
      drawPaddle(c, P2_X0, state.paddles.right.cy, COLORS.coral);
      if (state.ball) {
        const b = state.ball;
        for (let i = 0; i < b.trail.length; i++) {
          const p = b.trail[i]!,
            a = (i + 1) / b.trail.length;
          c.globalAlpha = (dim ? 0.15 : 0.07) + a * (dim ? 0.18 : 0.43);
          c.fillStyle = COLORS.gold;
          c.beginPath();
          c.arc(p.x, p.y, BALL_R * a, 0, Math.PI * 2);
          c.fill();
        }
        c.globalAlpha = dim ? 0.5 : 1;
        c.fillStyle = COLORS.gold;
        c.shadowColor = COLORS.gold;
        c.shadowBlur = 22;
        c.beginPath();
        c.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
        c.fill();
        c.shadowBlur = 0;
      }
      c.globalAlpha = 1;
      c.restore();
    };
    if (state.screen === "title") {
      field(true);
      centerText(c, TITLE_TEXT, FIELD_CY - 150, 76, COLORS.text, "800");
      centerText(
        c,
        "THE BANK SHOT DUEL",
        FIELD_CY - 96,
        17,
        COLORS.cyan,
        "700",
      );
      menu(c, TITLE_ITEMS, state.menuIndex);
      centerText(
        c,
        "W / S   MOVE     ENTER   SELECT     ESC   BACK",
        650,
        14,
        COLORS.muted,
      );
      return;
    }
    if (state.screen === "howto") {
      field(true);
      centerText(c, "HOW TO PLAY", 140, 48, COLORS.text, "800");
      centerText(
        c,
        "MOVE YOUR PADDLE TO RETURN THE BALL",
        244,
        20,
        COLORS.cyan,
        "700",
      );
      centerText(
        c,
        "Your paddle's motion adds spin. Spin bends the flight after impact.",
        292,
        18,
        COLORS.text,
      );
      centerText(
        c,
        "Use the angled obstacles to bank shots into open lanes.",
        326,
        18,
        COLORS.text,
      );
      centerText(
        c,
        "SOLO: W / S     VERSUS: W / S + UP / DOWN",
        384,
        17,
        COLORS.muted,
        "600",
      );
      menu(c, ["BACK TO TITLE"], 0);
      return;
    }
    field(false);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "800 52px system-ui, sans-serif";
    c.fillStyle = COLORS.text;
    c.fillText(String(state.score.p1).padStart(2, "0"), FIELD_CX - 90, 91);
    c.fillText(String(state.score.p2).padStart(2, "0"), FIELD_CX + 90, 91);
    c.font = "700 13px system-ui, sans-serif";
    c.fillStyle = COLORS.muted;
    c.fillText(
      state.mode === "solo" ? "SOLO • FIRST TO 11" : "VERSUS • LOCAL DUEL",
      FIELD_CX,
      133,
    );
    if (state.screen === "countdown") {
      centerText(
        c,
        state.ball?.holdTimer
          ? String(Math.max(1, Math.ceil(state.ball.holdTimer)))
          : "GO",
        FIELD_CY + 122,
        30,
        COLORS.gold,
        "800",
      );
    }
    if (state.screen === "paused") {
      overlay(c);
      centerText(c, "PAUSED", 280, 54, COLORS.text, "800");
      menu(c, PAUSE_ITEMS, state.menuIndex);
    }
    if (state.screen === "matchover") {
      overlay(c);
      centerText(
        c,
        state.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS",
        270,
        42,
        state.winner === "left" ? COLORS.cyan : COLORS.coral,
        "800",
      );
      centerText(
        c,
        `${state.score.p1}  —  ${state.score.p2}`,
        330,
        30,
        COLORS.text,
        "700",
      );
      menu(c, MATCHOVER_ITEMS, state.menuIndex);
    }
  },
};
function rounded(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
) {
  c.fillStyle = color;
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}
function drawPaddle(
  c: CanvasRenderingContext2D,
  x: number,
  cy: number,
  color: string,
) {
  c.save();
  c.shadowColor = color;
  c.shadowBlur = 22;
  rounded(c, x, cy - PADDLE_H / 2, PADDLE_W, PADDLE_H, 8, color);
  c.restore();
}
function centerText(
  c: CanvasRenderingContext2D,
  text: string,
  y: number,
  size: number,
  color: string,
  weight = "500",
) {
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = `${weight} ${size}px system-ui, sans-serif`;
  c.fillStyle = color;
  c.fillText(text, FIELD_CX, y);
}
function menu(
  c: CanvasRenderingContext2D,
  items: readonly string[],
  selected: number,
) {
  items.forEach((label, i) => {
    const r = rect(i);
    if (i === selected) {
      c.fillStyle = "#19283b";
      c.strokeStyle = "#55e6d0";
      c.lineWidth = 2;
      c.beginPath();
      c.roundRect(r.x, r.y, r.w, r.h, 12);
      c.fill();
      c.stroke();
    }
    centerText(
      c,
      label,
      r.y + r.h / 2,
      18,
      i === selected ? COLORS.text : COLORS.muted,
      i === selected ? "800" : "600",
    );
  });
}
function overlay(c: CanvasRenderingContext2D) {
  c.fillStyle = "rgba(5,9,17,.82)";
  c.fillRect(0, 0, FIELD_W, FIELD_H);
}
