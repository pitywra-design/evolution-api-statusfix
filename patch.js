const fs = require('fs');
const p = '/evolution/node_modules/baileys/lib/Socket/messages-recv.js';
let s = fs.readFileSync(p, 'utf8');
const anchor = "    ws.on('CB:ack,class:message', (node) => {";
const add = [
  "    // Fix Evolution #2778 / Baileys #2883: ack top-level <status> stanzas,",
  "    // otherwise WhatsApp drops the stream every ~50 min and holds back incoming messages.",
  "    ws.on('CB:status', (node) => {",
  "        sendMessageAck(node).catch(error => onUnexpectedError(error, 'acking status stanza'));",
  "    });",
  ""].join('\n');
if (s.split(anchor).length !== 2 || s.includes("CB:status")) { console.error('anchor not found or already patched'); process.exit(1); }
fs.writeFileSync(p, s.replace(anchor, add + anchor));
console.log('patched');
