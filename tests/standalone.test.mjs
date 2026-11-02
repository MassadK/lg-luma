import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('standalone identity, version and disabled lifecycle payloads', async () => {
  const manifest = JSON.parse(await fs.readFile('appinfo.json'));
  const project = JSON.parse(await fs.readFile('package.json'));
  assert.equal(manifest.id, 'com.lumaglass.launcher');
  assert.equal(manifest.type, 'native');
  assert.equal(manifest.version, project.version);
  for (const file of ['home.sh', 'autostart.sh', 'self-update.sh']) {
    const text = await fs.readFile(`tv/${file}`, 'utf8');
    assert.ok(text.includes('standalone only'));
    assert.ok(text.endsWith('exit 1\n'));
    assert.ok(!/mount|systemd|luna-send|\/usr\//.test(text));
  }
});
