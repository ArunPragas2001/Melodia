const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const instruments = require("../src/data/instruments.json");
const root = path.join(__dirname, "..");
const images = fs.readdirSync(path.join(root, "assets/images"));
const required = [
  "guitar",
  "violin",
  "cello",
  "flute",
  "trumpet",
  "saxophone",
  "drums",
  "tabla",
  "xylophone",
  "piano",
  "accordion",
  "organ",
];
assert.deepEqual(
  instruments.map((i) => i.id).sort(),
  required.sort(),
  "All 12 instruments need a record",
);
function text(value, label) {
  assert.equal(typeof value, "string", label);
  assert(value.trim().length > 0, label + " must not be blank");
}
for (const item of instruments) {
  assert(
    images.some((file) => path.parse(file).name === item.id),
    "Missing image: " + item.id,
  );
  const guide = item.playingGuide;
  assert(guide, "Missing playing guide: " + item.id);
  text(guide.setup, "Setup for " + item.id);
  assert(guide.method.length >= 4, "Missing method steps: " + item.id);
  guide.method.forEach((step) => {
    text(step.title, "Method title");
    text(step.instruction, "Method instruction");
  });
  for (const field of ["title", "tempo", "pattern", "legend", "goal"])
    text(guide.practice[field], field + " for " + item.id);
  assert(
    guide.practice.steps.length >= 4,
    "Missing practice steps: " + item.id,
  );
  guide.practice.steps.forEach((step) => text(step, "Practice step"));
  text(guide.demonstration, "Demonstration script for " + item.id);
  text(guide.tip, "Beginner tip for " + item.id);
}
assert.equal(
  new Set(instruments.map((i) => i.playingGuide.demonstration)).size,
  instruments.length,
  "Scripts must be instrument-specific",
);
for (const family of ["Strings", "Wind", "Percussion", "Keyboard"])
  assert.equal(instruments.filter((i) => i.family === family).length, 3);
console.log(
  "PASS: all 12 instruments have local images, full playing methods, practice patterns and unique demonstration scripts.",
);
const credits = require("../assets/image-credits.json");
assert.deepEqual(credits.map((entry) => entry.id).sort(), required.sort());
for (const credit of credits) {
  for (const field of ["source", "artist", "license", "licenseURL", "changes"]) text(credit[field], field);
}
console.log("PASS: four families and image attribution records are valid.");
