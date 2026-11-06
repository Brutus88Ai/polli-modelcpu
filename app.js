document.addEventListener('DOMContentLoaded', () => {
  const client = window.pollinationsClient;
  const termOutput = document.getElementById('termOutput');
  const termInput = document.getElementById('termInput');
  const btnSendOp = document.getElementById('btnSendOp');
  const hexViewer = document.getElementById('hexViewer');
  const machineStatus = document.getElementById('machineStatus');

  let state = {
    pc: '0x0024',
    sp: '0x00FF',
    a: '0x42',
    b: '0x10',
    x: '0x05',
    y: '0x0A'
  };

  function updateRegisters(s) {
    state = { ...state, ...s };
    document.getElementById('regPC').textContent = state.pc;
    document.getElementById('regSP').textContent = state.sp;
    document.getElementById('regA').textContent = state.a;
    document.getElementById('regB').textContent = state.b;
    document.getElementById('regX').textContent = state.x;
    document.getElementById('regY').textContent = state.y;
    renderHexDump();
  }

  function renderHexDump() {
    let rows = '';
    const baseAddr = parseInt(state.pc, 16) & 0xFFF0;
    for (let i = 0; i < 6; i++) {
      const addr = (baseAddr + i * 16).toString(16).toUpperCase().padStart(4, '0');
      const bytes = Array.from({length: 8}, (_, k) => ((baseAddr + i * 16 + k * 17) % 256).toString(16).toUpperCase().padStart(2, '0')).join(' ');
      rows += `<div class="hex-row"><span class="hex-addr">0x${addr}</span><span class="hex-bytes">${bytes}</span><span class="hex-ascii">..CPU..</span></div>`;
    }
    hexViewer.innerHTML = rows;
  }

  function appendTerminal(text, type = 'resp') {
    const div = document.createElement('div');
    div.className = `term-line ${type}`;
    div.textContent = text;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  async function executeCommand(cmd) {
    if (!cmd.trim()) return;
    appendTerminal(`>> ${cmd}`, 'cmd');
    termInput.value = '';
    machineStatus.textContent = 'STATUS: COMPUTING...';

    const res = await client.queryModelCPU(cmd, state);
    appendTerminal(res.output, 'resp');
    updateRegisters(res);
    machineStatus.textContent = 'STATUS: READY';
  }

  btnSendOp.addEventListener('click', () => executeCommand(termInput.value));
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeCommand(termInput.value);
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  renderHexDump();
});
