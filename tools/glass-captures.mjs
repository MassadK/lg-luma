// Actual native desktop framebuffers. No TV claims or network access.
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const base = '.build/glass-captures';
await fs.mkdir(base, { recursive: true });
await fs.mkdir('docs/liquid-glass', { recursive: true });
const appearance = 'settings,down,down,down,down,down,right';
for (const [name, style, opacity, script] of [
  ['home', 'liquid_glass', 55, 'home,down'],
  ['apps', 'liquid_glass', 55, 'apps,down'],
  ['settings', 'liquid_glass', 55, appearance],
  ['original-luma', 'original', 55, 'home,down'],
  ['crystal-clear', 'liquid_glass', 0, 'home,down'],
  ['frosted', 'liquid_glass', 100, 'home,down'],
  ['crystal-settings', 'liquid_glass', 0, appearance],
  ['frosted-settings', 'liquid_glass', 100, appearance],
]) {
  const prefs = `${base}/${name}.json`;
  await fs.writeFile(
    prefs,
    JSON.stringify({ interface_style: style, glass_transparency: opacity, reduced_motion: true }),
  );
  const result = spawnSync(
    'target/debug/luma',
    [
      '--assets',
      '.build/assets',
      '--preferences',
      prefs,
      '--script',
      script,
      '--frames',
      '40',
      '--time',
      '2026-11-02T20:41:00+03:00',
      '--screenshot',
      `docs/liquid-glass/${name}.png`,
      '--diagnostics',
      `${base}/${name}-render.json`,
      '--dump-state',
      `${base}/${name}-state.json`,
    ],
    {
      env: { ...process.env, SDL_VIDEODRIVER: process.env.SDL_VIDEODRIVER ?? 'offscreen' },
      stdio: 'inherit',
      timeout: 120000,
    },
  );
  assert.equal(result.status, 0, `${name} startup`);
  const report = JSON.parse(await fs.readFile(`${base}/${name}-render.json`));
  assert.equal(report.capture.missing_images, 0);
  assert.equal(report.capture.missing_glyphs, 0);
  assert.equal(report.capture.glyph_failures, 0);
  const state = JSON.parse(await fs.readFile(`${base}/${name}-state.json`));
  assert.equal(state.error, null);
  console.log(name, state.focus);
}
