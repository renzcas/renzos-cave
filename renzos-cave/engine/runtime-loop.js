// runtime-loop.js (ESM)
import { NeuralSpine } from "./neural-spine.js";
import { OrganReflexSystem } from "./organ-reflex-system.js";
import { ComplexityTensorOrgan } from "./complexity-tensor-organ.js";
import { FreeEnergyOrgan } from "./free-energy-organ.js";
import { MetabolicScheduler } from "./metabolic-scheduler.js";
import { AdaptiveOpcodeGovernor } from "./adaptive-opcode-governor.js";
import { CaveBrainstem } from "./cave-brainstem.js";
import { collectEngineSignals } from "./engine-signals.js";

export function startRuntimeLoop(engine, ui) {
    const spine = new NeuralSpine();
    const tensor = new ComplexityTensorOrgan();
    const freeEnergy = new FreeEnergyOrgan();
    const scheduler = new MetabolicScheduler();
    const opcodeGovernor = new AdaptiveOpcodeGovernor();
    const reflex = new OrganReflexSystem(spine, scheduler);
    const brainstem = new CaveBrainstem({
        spine,
        tensor,
        freeEnergy,
        scheduler,
        opcodeGovernor
    });

    function tick() {
        const signals = engine.collectSignals();

        tensor.update(signals);
        const control = freeEnergy.update({ ...signals, tensor });
        opcodeGovernor.update({ ...signals, tensor });

        const nextTask = scheduler.update({
            freeEnergy: freeEnergy.F,
            tensor,
            control
        });

        if (nextTask) nextTask.run();

        spine.emit("tick");
        spine.emit("stress", control.stress);
        spine.emit("chaos-rise", tensor.getVector().K / 100);
        spine.emit("memory-pressure", tensor.getVector().S / 100);

        brainstem.update();

        ui.updateFromEngine(signals, {
            tensor,
            freeEnergy,
            control,
            scheduler
        });

        setTimeout(tick, 16 * scheduler.loopRate);
    }

    tick();
}
