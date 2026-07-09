import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAccountability } from "../shared/resolve-accountability.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(
  fs.readFileSync(
    path.join(root, "public/data/accountable-india.json"),
    "utf8"
  )
);

test("resolves water complaint in Lucknow bottom to top", () => {
  const result = resolveAccountability(dataset, {
    problem: "No water in my society for three days",
    location: "Lucknow",
  });
  assert.equal(result.matchedTopic?.name, "Water Supply");
  assert.equal(result.jurisdiction?.name, "Lucknow");
  assert.ok(result.hierarchy.length >= 3);
  assert.match(result.hierarchy[0].role, /Municipal Commissioner/i);
  assert.equal(result.hierarchy[0].person?.name, "Gaurav Kumar");
  assert.ok(
    result.hierarchy.some((node) =>
      /District Magistrate|Collector/i.test(node.role)
    )
  );
  assert.ok(
    !result.hierarchy.some((node) => /Kanpur/i.test(node.role)),
    "must not include sibling-city offices"
  );
});

test("resolves police complaint to SP first", () => {
  const result = resolveAccountability(dataset, {
    problem: "police not filing FIR",
    location: "Jaipur",
  });
  assert.equal(result.matchedTopic?.name, "Police & Safety");
  assert.match(result.hierarchy[0].role, /Superintendent of Police/i);
});
