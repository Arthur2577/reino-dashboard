const { execFileSync } = require("node:child_process");
const { createServer } = require("node:http");
const { existsSync } = require("node:fs");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const hostname = "0.0.0.0";

if (!existsSync(".next/BUILD_ID")) {
  execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "build"], {
    stdio: "inherit",
  });
}

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((request, response) => handle(request, response)).listen(
    port,
    hostname,
    () => console.log(`Dashboard running on ${hostname}:${port}`),
  );
});
