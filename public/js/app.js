const term = new Terminal({
  theme: {
    background: '#191622',
    foreground: '#E1E1E6',
    cursor: '#E1E1E6',
    black: '#201B2D',
    brightBlack: '#4D4D4D',
    red: '#E96379',
    brightRed: '#ED4556',
    green: '#67E480',
    brightGreen: '#00F769',
    yellow: '#E7DE79',
    brightYellow: '#E7DE79',
    blue: '#78D1E1',
    brightBlue: '#78D1E1',
    magenta: '#988BC7',
    brightMagenta: '#988BC7',
    cyan: '#A1EFE4',
    brightCyan: '#A4FFFF',
    white: '#E1E1E6',
    brightWhite: '#F7F7FB'
  },
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  fontSize: 16
});

const fitAddon = new FitAddon.FitAddon();
const searchAddon = new SearchAddon.SearchAddon();
const webLinksAddon = new WebLinksAddon.WebLinksAddon();

term.loadAddon(fitAddon);
term.loadAddon(searchAddon);
term.loadAddon(webLinksAddon);

term.open(document.getElementById('terminal'));
fitAddon.fit();

const socket = io();

socket.on('output', data => term.write(data));
term.onData(data => socket.emit('input', data));
window.addEventListener('resize', () => {
  fitAddon.fit();
  socket.emit('resize', { cols: term.cols, rows: term.rows });
});

socket.on('stats', stats => {
  document.getElementById('stats').innerText = 
    `Load: ${stats.load.toFixed(2)} | RAM: ${stats.mem.toFixed(1)}% | Uptime: ${(stats.uptime/3600).toFixed(1)}h`;
});

// Initial resize
socket.emit('resize', { cols: term.cols, rows: term.rows });
