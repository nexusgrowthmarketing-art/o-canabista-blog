import fs from "node:fs";
import path from "node:path";
import { seedPosts, seedTeam } from "../lib/seed";

/** Gera o "banco" inicial em arquivo. Rode com: npx tsx scripts/seed.ts */
const dir = path.join(process.cwd(), "content");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  path.join(dir, "posts.json"),
  JSON.stringify(seedPosts(), null, 2),
  "utf-8",
);
fs.writeFileSync(
  path.join(dir, "team.json"),
  JSON.stringify(seedTeam(), null, 2),
  "utf-8",
);
console.log("Seed gravado em content/posts.json e content/team.json");
