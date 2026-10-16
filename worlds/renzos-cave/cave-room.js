import OperatorChamber from './src/operator/OperatorChamber.js';
import {
  applyMatrix,
  commutatorNorm,
  composeOperators,
  OPERATOR_KINDS,
  OperatorState,
  resonanceScore,
  vectorNorm
} from './src/operator/OperatorState.js';

const elements = {
  chamber: requireElement('#chamber'),
  angle: requireElement('#operator-angle'),
  angleOutput: requireElement('#angle-output'),
  resonanceValue: requireElement('#resonance-value'),
  resonanceMeter: requireElement('#resonance-meter'),
  normValue: requireElement('#norm-value'),
  normNote: requireElement('#norm-note'),
  commutatorValue: requireElement('#commutator-value'),
  lesson: requireElement('#lesson-copy'),
  caption: requireElement('#scene-caption')
};

const roomAngleDegrees = 35;
const roomOperator = new OperatorState(OPERATOR_KINDS.PROJECTION, roomAngleDegrees);
const playerOperator = new OperatorState(OPERATOR_KINDS.PROJECTION, roomAngleDegrees);
const referenceAngle = (roomAngleDegrees * Math.PI) / 180;
const referenceState = [Math.cos(referenceAngle), Math.sin(referenceAngle)];

const chamber = new OperatorChamber(elements.chamber, {
  onTextureError(error) {
    console.error('Character artwork could not be loaded:', error);
  }
});

const operatorButtons = [...document.querySelectorAll('[data-kind]')];
for (const button of operatorButtons) {
  button.addEventListener('click', () => {
    playerOperator.setKind(button.dataset.kind);
    operatorButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    updateReadout();
  });
}

elements.angle.addEventListener('input', () => {
  playerOperator.setAngle(Number(elements.angle.value));
  updateReadout();
});

updateReadout();
chamber.start();

window.addEventListener('beforeunload', () => chamber.dispose(), { once: true });

function updateReadout() {
  const roomMatrix = roomOperator.matrix;
  const playerMatrix = playerOperator.matrix;
  const commutator = commutatorNorm(roomMatrix, playerMatrix);
  const resonance = resonanceScore(roomMatrix, playerMatrix);
  const composed = composeOperators(roomMatrix, playerMatrix);
  const mappedState = applyMatrix(composed, referenceState);
  const stateNorm = vectorNorm(mappedState);

  chamber.setOperatorMatrix(composed);
  chamber.setResonance(resonance);

  elements.angleOutput.value = `${Math.round(playerOperator.angleDegrees)}°`;
  elements.angleOutput.textContent = elements.angleOutput.value;
  elements.resonanceValue.textContent = `${Math.round(resonance * 100)}%`;
  elements.resonanceMeter.style.width = `${resonance * 100}%`;
  elements.normValue.textContent = stateNorm.toFixed(2);
  elements.normNote.textContent = stateNorm > 0.995 ? 'Reference norm preserved' : 'Room projection contracts state';
  elements.commutatorValue.innerHTML =
    `‖[T<sub>room</sub>, T<sub>player</sub>]‖ = ${commutator.toFixed(2)}`;

  const commute = commutator < 0.015;
  elements.caption.textContent = commute
    ? 'These operators commute: order does not change this state.'
    : 'The operators do not commute: order changes the transformed state.';
  elements.lesson.textContent = lessonFor(playerOperator.kind, commute);
}

function lessonFor(kind, commute) {
  if (!commute) {
    return kind === OPERATOR_KINDS.ROTATION
      ? 'The rotation changes direction before the room projects it. Swap the order and the result changes: the commutator is nonzero.'
      : 'The player and room project onto different axes. Their order changes the result; align the axes to make the projections commute.';
  }
  return kind === OPERATOR_KINDS.ROTATION
    ? 'This rotation is the identity at 0°; it commutes with every operator. Nonzero rotations preserve vector length before the room acts.'
    : 'The projection axes match (or are orthogonal), so the projections commute. A projection preserves its axis and removes the orthogonal component.';
}

function requireElement(selector) {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Required operator-chamber element is missing: ${selector}`);
  return element;
}
