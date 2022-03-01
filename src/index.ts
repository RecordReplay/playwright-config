import path from "path";

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const EXECUTABLE_PATHS = {
  "darwin:firefox": ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"],
  "linux:chromium": ["chrome-linux", "chrome"],
  "linux:firefox": ["firefox", "firefox"],
} as const;

function getPlatformKey(browserName: BrowserName): keyof typeof EXECUTABLE_PATHS | undefined {
  const key = `${process.platform}:${browserName}`;
  switch (key) {
    case "darwin:firefox":
    case "linux:firefox":
    case "linux:chromium":
      return key;
  }

  return undefined;
}

export function getExecutablePath(browserName: BrowserName) {
  // Override with replay specific browsers.
  const replayDir =
    process.env.RECORD_REPLAY_DIRECTORY ||
    path.join(process.env.HOME!, ".replay");

  const key = getPlatformKey(browserName);
  if (!key) {
    return;
  }

  return path.join(replayDir, "playwright", ...EXECUTABLE_PATHS[key]);
}

function getDeviceConfig(browserName: BrowserName) {
  const executablePath = getExecutablePath(browserName);
  if (!executablePath) {
    console.warn(`${browserName} is not supported on this platform`);
  }

  return {
    launchOptions: {
      executablePath,
      env: {
        RECORD_ALL_CONTENT: 1
      },
    },
    defaultBrowserType: browserName,
  };
}

export const devices = {
  get "Replay Firefox"() {
    return getDeviceConfig("firefox");
  },
  get "Replay Chromium"() {
    return getDeviceConfig("chromium");
  },
};
