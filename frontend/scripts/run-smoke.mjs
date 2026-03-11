import { request } from "node:http";
import { spawn } from "node:child_process";

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const ping = () => {
      const req = request(url, { method: "GET" }, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) {
          resolve(true);
          return;
        }
        retry();
      });

      req.on("error", retry);
      req.end();
    };

    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server not ready within ${timeoutMs}ms`));
        return;
      }
      setTimeout(ping, 500);
    };

    ping();
  });
}

const smokeEnv = {
  ...process.env,
  VITE_AI_API_KEY: "",
  VITE_AI_API_URL: "",
  VITE_AI_API_ENDPOINT: "",
  VITE_AI_MODEL: ""
};

const vite = spawn("node", ["./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "4173"], {
  cwd: process.cwd(),
  stdio: "inherit",
  env: smokeEnv
});

let exitCode = 1;

try {
  await waitForServer("http://127.0.0.1:4173");

  exitCode = await new Promise((resolve) => {
    const runner = spawn("node", ["./node_modules/@playwright/test/cli.js", "test", "-c", "../tests/e2e/playwright.config.ts"], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: smokeEnv
    });
    runner.on("close", (code) => resolve(code ?? 1));
  });
} catch (err) {
  console.error(err);
  exitCode = 1;
} finally {
  vite.kill("SIGTERM");
}

process.exit(exitCode);
