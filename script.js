// =================== MAPEAMENTO 1–9 -> POKÉMON ===================
const POKEMAP = [null,
    {
        name: 'Pikachu',
        gen: 1,
        img: 'assets/1Pikachu.png'
    },
    {
        name: 'Sudowoodo',
        gen: 2,
        img: 'assets/2Sudowoodo.png'
    },
    {
        name: 'Milotic',
        gen: 3,
        img: 'assets/3Milotic.png'
    },
    {
        name: 'Weavile',
        gen: 4,
        img: 'assets/4Weavile.png'
    },
    {
        name: 'Chandelure',
        gen: 5,
        img: 'assets/5Chandelure.png'
    },
    {
        name: 'Skiddo',
        gen: 6,
        img: 'assets/6Skiddo.png'
    },
    {
        name: 'Litten',
        gen: 7,
        img: 'assets/7Litten.png'
    },
    {
        name: 'Applin',
        gen: 8,
        img: 'assets/8Applin.png'
    },
    {
        name: 'Tinkaton',
        gen: 9,
        img: 'assets/9Tinkaton.png'
    },
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
let PUZZLE = [
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
const toggleBtn = document.getElementById('toggleLabel');
const checkBtn = document.getElementById('check');
const solveBtn = document.getElementById('solve');
const clearBtn = document.getElementById('clear');
const newGameBtn = document.getElementById('newGame');

let displayMode = "sprite"; // sprite | name | number
let selectedCell = null;

// =================== FUNÇÕES ===================

// Renderiza o conteúdo da célula
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

// Gera um novo puzzle aleatório
function generatePuzzle() {
    let puzzle = SOL.map(row => [...row]);

    // embaralhar linhas dentro de cada bloco de 3
    for (let block = 0; block < 3; block++) {
        puzzle.splice(block * 3, 3, ...shuffle(puzzle.slice(block * 3, block * 3 + 3)));
    }

    // embaralhar colunas (transposição)
    puzzle = transpose(puzzle);
    for (let block = 0; block < 3; block++) {
        puzzle.splice(block * 3, 3, ...shuffle(puzzle.slice(block * 3, block * 3 + 3)));
    }
    puzzle = transpose(puzzle);

    // remover números para criar desafio
    let holes = 40;
    while (holes > 0) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (puzzle[r][c] !== 0) {
            puzzle[r][c] = 0;
            holes--;
        }
    }

    return puzzle;
}

// Helpers
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function transpose(m) {
    return m[0].map((_, i) => m.map(r => r[i]));
}

// Monta o tabuleiro
function buildBoard() {
    board.innerHTML = "";
    for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
            const box = document.createElement('div');
            box.className = 'box';
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const R = br * 3 + r;
                    const C = bc * 3 + c;
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
                            if (selectedCell) selectedCell.classList.remove('selected');
                            selectedCell = cell;
                            cell.classList.add('selected');
                        });
                    }
                    box.appendChild(cell);
                }
            }
            board.appendChild(box);
        }
    }
}

// =================== LEGENDA ===================
POKEMAP.slice(1).forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'p';
    d.innerHTML = `<b>${i + 1}</b> <img src="${p.img}" alt="${p.name}" class="poke-icon"> <span>${p.name}</span>`;
    legend.appendChild(d);
});

// =================== EVENTOS ===================

// Captura digitação
document.addEventListener('keydown', (e) => {
    if (!selectedCell || selectedCell.classList.contains('lock')) return;

    const n = parseInt(e.key);
    if (n >= 1 && n <= 9) {
        selectedCell.dataset.val = n;
        renderCell(selectedCell, n);
        selectedCell.classList.remove('empty', 'bad', 'ok');

        // Tocar som
        sound.currentTime = 0;
        sound.play();
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
        selectedCell.dataset.val = 0;
        renderCell(selectedCell, 0);
        selectedCell.classList.add('empty');
        selectedCell.classList.remove('bad', 'ok');

        // Tocar som ao apagar
        sound.currentTime = 0;
        sound.play();
    }
});


// Alternar exibição
toggleBtn.addEventListener('click', () => {
    displayMode = displayMode === "sprite" ? "name" : displayMode === "name" ? "number" : "sprite";
    refreshLabels();
});

// Verificar
checkBtn.addEventListener('click', () => {
    const cells = [...document.querySelectorAll('.cell')];
    let allCorrect = true;
    let allFilled = true;

    cells.forEach((el, i) => {
        const r = Math.floor(i / 9);
        const c = i % 9;
        const v = +el.dataset.val;

        if (v === 0) {
            allFilled = false; // achou célula vazia
            return;
        }

        const good = (v === SOL[r][c]);
        if (!el.classList.contains('lock')) {
            el.classList.toggle('ok', good);
            el.classList.toggle('bad', !good);
            if (!good) allCorrect = false;
        }
    });

    // Só exibe alerta se todas as células estiverem preenchidas e corretas
    if (allFilled && allCorrect) {
        alert('Perfeito! Você completou corretamente o tabuleiro.');
    }
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
    document.querySelectorAll('.cell').forEach((el) => {
        if (!el.classList.contains('lock')) {
            el.dataset.val = 0;
            renderCell(el, 0);
            el.classList.add('empty');
            el.classList.remove('bad', 'ok', 'selected');
        }
    });
});

// Novo jogo
function newGame() {
    PUZZLE = generatePuzzle();
    buildBoard();
    refreshLabels();
}
newGameBtn.addEventListener('click', newGame);


// =================== AUTO START ===================
newGame(); // já inicia com puzzle novo ao carregar

// =================== TEMA CLARO/ESCURO ===================
const lightModeBtn = document.getElementById('lightMode');
lightModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    lightModeBtn.textContent = document.body.classList.contains('light-mode') ? 'Modo escuro' : 'Modo claro';
});
lightModeBtn.textContent = 'Modo claro'; // estado inicial



// =================== SOM DE CLIQUE NOS BOTÕES ===================
const buttons = document.querySelectorAll('.playButton');
const sound = document.getElementById('clickSound');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        sound.currentTime = 0; // reinicia o som se clicar várias vezes
        sound.play();
    });
});



