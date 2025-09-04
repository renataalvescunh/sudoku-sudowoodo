// =================== MAPEAMENTO 1–9 -> POKÉMON ===================
const POKEMAP = [null,
    {
        name: 'Pikachu',
        gen: 1,
        img: 'assets/1Pikachu.png'
    }, // 1
    {
        name: 'Sudowoodo',
        gen: 2,
        img: 'assets/2Sudowoodo.png'
    }, // 2
    {
        name: 'Milotic',
        gen: 3,
        img: 'assets/3Milotic.png'
    }, // 3
    {
        name: 'Weavile',
        gen: 4,
        img: 'assets/4Weavile.png'
    }, // 4
    {
        name: 'Chandelure',
        gen: 5,
        img: 'assets/5Chandelure.png'
    }, // 5
    {
        name: 'Skiddo',
        gen: 6,
        img: 'assets/6Skiddo.png'
    }, // 6
    {
        name: 'Litten',
        gen: 7,
        img: 'assets/7Litten.png'
    }, // 7
    {
        name: 'Applin',
        gen: 8,
        img: 'assets/8Applin.png'
    }, // 8
    {
        name: 'Tinkaton',
        gen: 9,
        img: 'assets/9Tinkaton.png'
    }, // 9
];

// =================== SOLUÇÃO BASE ===================
const SOL = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8]
];

// =================== QUEBRA-CABEÇA (0 = vazio) ===================
const PUZZLE = [
    [0, 2, 0, 4, 0, 6, 0, 8, 0],
    [4, 0, 6, 0, 8, 0, 1, 0, 3],
    [0, 8, 0, 1, 0, 3, 0, 5, 0],
    [2, 0, 4, 0, 6, 0, 8, 0, 1],
    [0, 6, 0, 8, 0, 1, 0, 3, 0],
    [8, 0, 1, 0, 3, 0, 5, 0, 7],
    [0, 4, 0, 6, 0, 8, 0, 1, 0],
    [6, 0, 8, 0, 1, 0, 3, 0, 5],
    [0, 1, 0, 3, 0, 5, 0, 7, 0]
];

// =================== ELEMENTOS ===================
const board = document.getElementById('board');
const legend = document.getElementById('legend');
const modal = document.getElementById('modal');
const picker = document.getElementById('picker');
const toggleBtn = document.getElementById('toggleLabel');
const checkBtn = document.getElementById('check');
const solveBtn = document.getElementById('solve');
const clearBtn = document.getElementById('clear');

let displayMode = "sprite"; // sprite | name | number
let selectedCell = null;

// =================== FUNÇÕES ===================

// Renderiza o conteúdo da célula de acordo com o modo
function renderCell(el, v) {
    el.innerHTML = "";
    if (v === 0) return;

    if (displayMode === "sprite") {
        const img = document.createElement('img');
        img.src = POKEMAP[v].img;
        img.alt = POKEMAP[v].name;
        img.className = "poke-icon";
        el.appendChild(img);
    } else if (displayMode === "name") {
        el.textContent = POKEMAP[v].name;
    } else {
        el.textContent = v;
    }
}

// Atualiza todas as células
function refreshLabels() {
    document.querySelectorAll('.cell').forEach(el => {
        const v = +el.dataset.val;
        renderCell(el, v);
    });

    toggleBtn.textContent =
        `Mostrar: ${displayMode === "sprite" ? "Nomes" : displayMode === "name" ? "Números" : "Sprites"}`;
}

// =================== LEGENDA ===================
POKEMAP.slice(1).forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'p';
    d.innerHTML = `<b>${i + 1}</b> <img src="${p.img}" alt="${p.name}" class="poke-icon"> <span>${p.name}</span>`;
    legend.appendChild(d);
});

// =================== PALETA ===================
for (let n = 1; n <= 9; n++) {
    const o = document.createElement('div');
    o.className = 'opt';
    o.innerHTML = `<img src="${POKEMAP[n].img}" class="poke-icon"><br><small>${POKEMAP[n].name}</small>`;
    o.addEventListener('click', () => {
        if (!selectedCell) return;
        selectedCell.dataset.val = n;
        renderCell(selectedCell, n);
        selectedCell.classList.remove('empty', 'bad', 'ok');
        modal.close();
    });
    picker.appendChild(o);
}

// =================== TABULEIRO ===================
for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
        const box = document.createElement('div');
        box.className = 'box';
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const R = br * 3 + r,
                    C = bc * 3 + c;
                const val = PUZZLE[R][C];
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (val !== 0) {
                    cell.classList.add('lock');
                    cell.dataset.val = val;
                    renderCell(cell, val);
                } else {
                    cell.classList.add('empty');
                    cell.dataset.val = 0;
                    cell.addEventListener('click', () => {
                        selectedCell = cell;
                        modal.showModal();
                    });
                }
                box.appendChild(cell);
            }
        }
        board.appendChild(box);
    }
}

// =================== EVENTOS ===================

// Alternar exibição
toggleBtn.addEventListener('click', () => {
    if (displayMode === "sprite") displayMode = "name";
    else if (displayMode === "name") displayMode = "number";
    else displayMode = "sprite";
    refreshLabels();
});

// Verificar
checkBtn.addEventListener('click', () => {
    const cells = [...document.querySelectorAll('.cell')];
    let okAll = true;
    cells.forEach((el, i) => {
        const r = Math.floor(i / 9),
            c = i % 9;
        const v = +el.dataset.val;
        const good = (v === SOL[r][c]);
        if (!el.classList.contains('lock')) {
            el.classList.toggle('ok', good && v !== 0);
            el.classList.toggle('bad', !good && v !== 0);
            if (!good && v !== 0) okAll = false;
        }
    });
    if (okAll) alert('Perfeito! Você completou corretamente as jogadas marcadas.');
});

// Resolver
solveBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach((el, i) => {
        const r = Math.floor(i / 9),
            c = i % 9;
        const v = SOL[r][c];
        el.dataset.val = v;
        renderCell(el, v);
        el.classList.remove('empty', 'bad');
    });
});

// Limpar
clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach((el, i) => {
        if (!el.classList.contains('lock')) {
            el.dataset.val = 0;
            renderCell(el, 0);
            el.classList.add('empty');
            el.classList.remove('bad', 'ok');
        }
    });
});
