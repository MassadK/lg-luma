import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const dir = '.build/glass-smoke';
await fs.mkdir(dir, { recursive: true });
const prefs = `${dir}/preferences.json`;
const appearance = 'settings,down,down,down,down,down,right';
await fs.writeFile(prefs, JSON.stringify({ reduced_motion: true }));
async function run(name, script) {
  const dump = `${dir}/${name}.json`;
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
      '90',
      '--dump-state',
      dump,
    ],
    {
      env: { ...process.env, SDL_VIDEODRIVER: process.env.SDL_VIDEODRIVER ?? 'offscreen' },
      stdio: 'inherit',
      timeout: 120000,
    },
  );
  assert.equal(result.status, 0, name);
  const state = JSON.parse(await fs.readFile(dump));
  assert.equal(state.error, null);
  return state;
}
let state = await run('slider', `${appearance},down,left,left`);
assert.equal(state.preferences.glass_transparency, 45);
assert.equal(JSON.parse(await fs.readFile(prefs)).glass_transparency, 45);
state = await run('restart', 'home,down');
assert.equal(state.preferences.glass_transparency, 45);
state = await run('original', `${appearance},enter`);
assert.equal(state.preferences.interface_style, 'original');
assert.ok(!state.ui_text.includes('Glass Transparency'));
state = await run('glass', `${appearance},enter`);
assert.equal(state.preferences.interface_style, 'liquid_glass');
assert.equal(state.preferences.glass_transparency, 45);
state = await run('crystal', `${appearance},down,down,enter`);
assert.equal(state.preferences.glass_transparency, 0);
state = await run('frosted', `${appearance},down,down,down,down,enter`);
assert.equal(state.preferences.glass_transparency, 100);
state = await run('pointer-balanced', 'settings,click:350:535,click:850:520');
assert.equal(state.preferences.glass_transparency, 55);
state = await run('launch', 'apps,down,enter,enter');
assert.equal(state.page, 'Apps');
console.log(
  'PASS: native startup, remote controls, pointer preset, restart persistence, style visibility, presets and desktop launch action. TV service behavior remains unverified.',
);
