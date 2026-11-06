# ModelCPU - 8-Bit Machine Simulated by LLMs

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)



**ModelCPU** is an interactive virtual computer architecture and VT100 terminal inspired by [WorldTUI](https://simedw.com/2026/10/21/world-model-terminal/) and [nesformer](https://github.com/dbreunig/nesformer). An AI model simulates the microcode, registers, ALU calculations, and memory state of an 8-bit machine.

Built for the **Pollinations Quest #19179: [QUEST] An app or game where a model plays a machine**.

## Features

- **Virtual Architecture**: Tracks Program Counter (PC), Stack Pointer (SP), Accumulator (ACC), Registers B, X, Y, and status flags (Zero, Carry, Interrupt, Overflow, Negative).
- **RAM Hex Viewer**: Real-time 64KB virtual RAM memory inspection.
- **Microcode Execution**: Run assembly instructions, step single clock cycles, execute Fibonacci routines or prime sieves.
- **Zero-Pollen Guarantee**: Features a full local offline CPU execution engine so users can explore and run code without spending any Pollen, alongside `<polli-connect>` Bring Your Own Pollen (BYOP) integration for full LLM-driven machine synthesis.
- **Pollinations Integration**: Direct integration with `https://gen.pollinations.ai/v1/chat/completions`.

## Live Demo

- **Live App**: https://brutus88ai.github.io/polli-modelcpu/
- **Repository**: https://github.com/Brutus88Ai/polli-modelcpu

## License

MIT
