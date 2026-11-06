// Pollinations Client with BYOP and 0-Pollen offline simulation fallback
class PollinationsClient {
  constructor() {
    this.apiBase = 'https://gen.pollinations.ai';
    this.chatEndpoint = 'https://gen.pollinations.ai/v1/chat/completions';
    this.defaultModel = 'openai';
  }

  getApiKey() {
    const el = document.getElementById('polliConnect');
    if (el && el.apiKey) return el.apiKey;
    return localStorage.getItem('polli_key') || null;
  }

  async queryModelCPU(prompt, state) {
    const key = this.getApiKey();
    if (!key) {
      // Offline fallback: simulate CPU cycle without spending pollen
      return this.simulateOfflineCycle(prompt, state);
    }

    try {
      const systemPrompt = `You are an 8-bit Computer Processor (ModelCPU VT100 Emulator).
Given the input command and current machine state:
PC=${state.pc}, SP=${state.sp}, ACC=${state.a}, B=${state.b}, X=${state.x}, Y=${state.y}
Simulate the machine logic and reply strictly in valid JSON:
{
  "output": "Console print string",
  "pc": "0x0028",
  "sp": "0x00FF",
  "a": "0x43",
  "b": "0x10",
  "x": "0x06",
  "y": "0x0A",
  "cycles": 4
}`;

      const res = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn('Fallback to offline simulation:', e);
      return this.simulateOfflineCycle(prompt, state);
    }
  }

  simulateOfflineCycle(cmd, state) {
    const c = cmd.toLowerCase().trim();
    let pcVal = parseInt(state.pc, 16) + 4;
    let aVal = parseInt(state.a, 16);
    let bVal = parseInt(state.b, 16);
    let xVal = parseInt(state.x, 16);
    let yVal = parseInt(state.y, 16);
    let output = '';

    if (c.includes('fibonacci')) {
      let next = aVal + bVal;
      aVal = bVal;
      bVal = next % 256;
      output = `FIBONACCI STEP: Next value computed: ${bVal} (ACC=${aVal.toString(16).toUpperCase()}, B=${bVal.toString(16).toUpperCase()})`;
    } else if (c.includes('primes')) {
      xVal += 2;
      output = `PRIME SIEVE CYCLE: Testing integer candidate N=${xVal} against memory segment 0x0100... [PRIME CONFIRMED]`;
    } else if (c.includes('dump') || c.includes('peek')) {
      output = `MEMORY AT 0x0020: 48 65 6C 6C 6F 20 57 6F 72 6C 64 21 00 A9 01 8D | Hello World!...`;
    } else if (c.includes('step')) {
      aVal = (aVal + 1) % 256;
      output = `CLK STEP: Executed INC A. Resulting ACC=0x${aVal.toString(16).toUpperCase().padStart(2, '0')}`;
    } else if (c.includes('reset')) {
      pcVal = 0x0000;
      aVal = 0x00;
      bVal = 0x00;
      output = `HARD RESET TRIGGERED. Vector reset to 0x0000. Registers cleared.`;
    } else {
      aVal = (aVal ^ 0x0F);
      output = `EXECUTED [${cmd}]: 2 cycles elapsed. ALU Result: 0x${aVal.toString(16).toUpperCase().padStart(2, '0')}`;
    }

    return {
      output: output,
      pc: `0x${pcVal.toString(16).toUpperCase().padStart(4, '0')}`,
      sp: state.sp,
      a: `0x${aVal.toString(16).toUpperCase().padStart(2, '0')}`,
      b: `0x${bVal.toString(16).toUpperCase().padStart(2, '0')}`,
      x: `0x${xVal.toString(16).toUpperCase().padStart(2, '0')}`,
      y: `0x${yVal.toString(16).toUpperCase().padStart(2, '0')}`,
      cycles: 2
    };
  }
}
window.pollinationsClient = new PollinationsClient();
