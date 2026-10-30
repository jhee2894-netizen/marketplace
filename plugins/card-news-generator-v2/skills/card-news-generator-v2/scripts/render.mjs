// 카드 HTML 폴더를 PNG로 렌더한다.
// 사용법: node render.mjs <cards 폴더> <out 폴더> [너비=1080] [높이=1350]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";

const [cardsDir, outDir, w = "1080", h = "1350"] = process.argv.slice(2);
if (!cardsDir || !outDir) {
  console.error("사용법: node render.mjs <cards 폴더> <out 폴더> [너비] [높이]");
  process.exit(1);
}

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome/Edge를 찾지 못했다. CHROME_PATH 환경 변수에 실행 파일 경로를 넣어라.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const files = readdirSync(cardsDir).filter((f) => f.endsWith(".html")).sort();
if (files.length === 0) {
  console.error(`${cardsDir}에 .html 파일이 없다.`);
  process.exit(1);
}

for (const f of files) {
  const out = resolve(join(outDir, basename(f, ".html") + ".png"));
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=5000",
    `--window-size=${w},${h}`,
    `--screenshot=${out}`,
    pathToFileURL(resolve(join(cardsDir, f))).href,
  ], { stdio: "ignore" });
  console.log(`렌더 완료: ${out}`);
}
