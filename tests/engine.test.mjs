import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';

// Load TypeScript through the installed compiler so Node 22 needs no experimental flags.
const catalog = ts.transpile(readFileSync(new URL('../client/src/demo/catalog.ts', import.meta.url), 'utf8'), { module: ts.ModuleKind.ESNext });
const catalogUrl = `data:text/javascript;base64,${Buffer.from(catalog).toString('base64')}`;
const source = ts.transpile(readFileSync(new URL('../client/src/demo/engine.ts', import.meta.url), 'utf8'), { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }).replace('./catalog.ts', catalogUrl);
const { ScenarioEngine } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const { scenes } = await import(catalogUrl);

test('scene identifiers are unique and contracts complete', () => {
  assert.equal(new Set(scenes.map(s => s.id)).size, scenes.length);
  for (const scene of scenes) {
    for (const key of ['name', 'message', 'recovery', 'process', 'prerequisite']) assert.ok(scene[key]);
    assert.ok(scene.stage === 'global' || scene.operations.length);
  }
});
for (const scene of scenes) {
  test(`${scene.id}: immediate preview never commits; recovery commits once`, t => {
    t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
    const engine = new ScenarioEngine();
    let commits = 0;
    const request = { operation: scene.operations[0] ?? 'devices.load', stage: scene.stage === 'global' ? 'devices' : scene.stage, label: '测试', delay: 20, success: () => commits++ };
    engine.run(request, { previewId: scene.id });
    assert.ok(engine.getSnapshot().active);
    t.mock.timers.tick(20000);
    assert.equal(commits, 0);
    if (engine.getSnapshot().active.status === 'loading') {
      engine.normal(); engine.run(request);
    } else engine.retry();
    t.mock.timers.tick(21);
    assert.equal(commits, 1);
    engine.retry(); t.mock.timers.tick(10000);
    assert.equal(commits, 1);
    engine.normal();
  });
}
test('failure retry, policy change, cancel, route change, and reset prevent stale commits', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  const engine = new ScenarioEngine();
  let commits = 0;
  const request = { operation: 'items.save', stage: 'items', label: '保存', delay: 20, success: () => commits++ };
  engine.run(request, { previewId: 'items.save' });
  engine.setRetry('failure'); engine.retry(); t.mock.timers.tick(1100);
  assert.equal(commits, 0); assert.equal(engine.getSnapshot().active.status, 'error');
  engine.setRetry('success'); engine.retry(); t.mock.timers.tick(21);
  assert.equal(commits, 1);
  for (const cancel of [engine.cancel, engine.normal, engine.routeChanged, () => engine.reset('items'), () => engine.reset()]) {
    engine.run(request); cancel(); t.mock.timers.tick(10000);
    assert.equal(commits, 1); assert.equal(engine.getSnapshot().active, null);
  }
});
test('normal mode cancels preview without writing; double submit cannot duplicate writes', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  const engine = new ScenarioEngine();
  let commits = 0;
  const request = { operation: 'cleaning.start', stage: 'cleaning', label: '启动', delay: 20, success: () => commits++ };
  engine.run(request, { previewId: 'cleaning.failure' }); engine.normal(); t.mock.timers.tick(10000);
  assert.equal(commits, 0);
  engine.run(request); assert.equal(engine.run(request), false); t.mock.timers.tick(21);
  assert.equal(commits, 1);
});
test('preview stays visible until form requirements are satisfied', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  const engine = new ScenarioEngine();
  let ready = false, commits = 0;
  const request = { operation: 'items.save', stage: 'items', label: '保存', delay: 20, ready: () => ready, success: () => commits++ };
  engine.run(request, { previewId: 'items.save' });
  engine.retry(); t.mock.timers.tick(10000);
  assert.equal(commits, 0);
  assert.equal(engine.getSnapshot().active.status, 'error');
  ready = true;
  engine.retry(); t.mock.timers.tick(21);
  assert.equal(commits, 1);
});
