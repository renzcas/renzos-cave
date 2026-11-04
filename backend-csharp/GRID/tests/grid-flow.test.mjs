import assert from 'node:assert/strict';
import test from 'node:test';

import { wireCaveAgents } from '../cave_bridge/cave_agents.js';
import { wireCaveEvents } from '../cave_bridge/cave_events.js';
import { GRID_EVENTS, GridBus } from '../core/event_bus.js';
import { initGridHUD } from '../cockpit/grid_hud.js';

test('GRID event envelope supports unsubscribing listeners', () => {
  GridBus.listeners.clear();
  GridBus.history.length = 0;

  const received = [];
  const unsubscribe = GridBus.subscribe('TEST_EVENT', event => received.push(event));
  const event = GridBus.publish('TEST_EVENT', { value: 1 }, 'test-source');
  unsubscribe();
  GridBus.publish('TEST_EVENT', { value: 2 }, 'test-source');

  assert.equal(received.length, 1);
  assert.equal(received[0], event);
  assert.equal(event.source, 'test-source');
  assert.equal(event.topic, 'TEST_EVENT');
  assert.deepEqual(event.payload, { value: 1 });
});

test('creature state flows through the agent decision to the cave and HUD', () => {
  GridBus.listeners.clear();
  GridBus.history.length = 0;

  let onCreatureUpdate;
  const appliedBehaviors = [];
  const telemetry = [];
  const creature = {
    id: 'creature-1',
    getState: () => ({ threat: 0.9 })
  };
  const caveWorld = {
    onCreatureUpdate(callback) {
      onCreatureUpdate = callback;
    },
    onLabyrinthGenerated() {},
    applyBehavior(id, action) {
      appliedBehaviors.push({ id, action });
    }
  };
  const neuralInterface = {
    processCreatureState: state => ({ threat: state.threat }),
    generateBehavior: signals => ({
      id: creature.id,
      action: signals.threat > 0.5 ? 'retreat' : 'hold'
    })
  };
  const agentDash = {
    pushTelemetry: (channel, payload) => telemetry.push({ channel, payload })
  };

  try {
    wireCaveEvents(caveWorld);
    wireCaveAgents(caveWorld, neuralInterface);
    initGridHUD(agentDash);
    onCreatureUpdate(creature);

    assert.deepEqual(appliedBehaviors, [
      { id: 'creature-1', action: 'retreat' }
    ]);
    assert.deepEqual(telemetry, [
      { channel: 'cave', payload: { threat: 0.9 } }
    ]);
    assert.deepEqual(
      GridBus.history.map(event => event.topic),
      [GRID_EVENTS.CREATURE_STATE_UPDATE, GRID_EVENTS.AGENT_DECISION]
    );
  } finally {
    GridBus.listeners.clear();
    GridBus.history.length = 0;
  }
});