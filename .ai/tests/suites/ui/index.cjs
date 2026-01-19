const path = require('path');

const uiSystemBootstrap = require('./ui-system-bootstrap.cjs');
const uiGovernanceGate = require('./ui-governance-gate.cjs');
const uiStyleIntake = require('./ui-style-intake-from-image.cjs');

const TESTS = [uiSystemBootstrap, uiGovernanceGate, uiStyleIntake];

function run(ctx) {
  const results = [];

  for (const t of TESTS) {
    const name = t.name || 'unnamed-test';
    ctx.log(`[tests][ui] start: ${name}`);
    const res = t.run(ctx);
    results.push(res);
    ctx.log(`[tests][ui] done: ${name} (${res.status})`);
    if (res.status === 'FAIL') break;
  }

  return results;
}

module.exports = { run };
