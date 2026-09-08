import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const files = ["contracts/agentlease_court.py", "studio_bradbury/agentlease_court.py"];
const hashes = files.map((file) => {
  const content = readFileSync(resolve(root, file));
  return { file, sha256: createHash("sha256").update(content).digest("hex") };
});

if (hashes[0].sha256 !== hashes[1].sha256) {
  throw new Error("Deployable contract copies are not identical");
}

console.log(JSON.stringify({ contract: "AgentLeaseCourt", source: hashes[0] }, null, 2));
