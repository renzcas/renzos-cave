// engine-signals.js (ESM)
export function collectEngineSignals(vm, fractal, memory) {
    return {
        timeSteps: vm.instructionCount || 0,
        spaceBytes: (memory.heapSize || 0) + (memory.stackSize || 0),
        ioBytes: vm.bytesMovedThisTick || 0,
        energyCost: vm.energyCostThisTick || 0,
        algoComplexity: fractal.currentComplexity || 0,
        entropyFlow: (vm.branchEntropy || 0) + (vm.erasureEntropy || 0),
        predictionError: fractal.predictionError || 0
    };
}
