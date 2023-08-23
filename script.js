// Das Spielfeld-Array
let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // vertical
    [0, 4, 8],
    [2, 4, 6], // diagonal
];

let currentPlayer = 'circle';

function init() {
    render();
}

// Die render-Funktion
function render() {
    const contentDiv = document.getElementById('content');

    // Generate table HTML
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            let tdId = `cell_${index}`;
            tableHtml += `<td id="${tdId}" onclick="updateField(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    // Set table HTML to contentDiv
    contentDiv.innerHTML = tableHtml;

}

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}

// Funktion zur Aktualisierung des Spielfelds
function updateField(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        // 'circle' ? 'cross' : 'circle'; ist die kurz Schreibweise für eine IF- Else Funktion
        // if (currentPlayer === 'circle') {
        //    currentPlayer = 'cross';
        //    } else {
        //    currentPlayer = 'circle';
        //    }

        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            drawWinningLine(winCombination);
        }
    }
}

function generateCircleSVG() {
    const color = '#00B0EF';
    const width = 70;
    const height = 70;

    return /*html*/ `
    <svg width="${width}" height="${height}">
        <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
            <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.5s" fill="freeze" />
        </circle>
    </svg>`;
}

function generateCrossSVG() {
    return /*html*/ `
<svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="10" x2="10" y2="10" stroke="#FFC000" stroke-width="5">
        <animate attributeName="x2" from="0" to="60" dur="0.25s" begin="0s" fill="freeze" />
        <animate attributeName="y2" from="0" to="60" dur="0.25s" begin="0s" fill="freeze" />
    </line>
    <line x1="60" y1="10" x2="60" y2="10" stroke="#FFC000" stroke-width="5">
        <animate attributeName="x2" from="70" to="10" dur="0.25s" begin="0.25s" fill="freeze" />
        <animate attributeName="y2" from="0" to="60" dur="0.25s" begin="0.25s" fill="freeze" />
    </line>
</svg>
    `
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = '0'; // Start with zero width
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById("content").appendChild(line);

    // Trigger the animation by changing the width
    setTimeout(() => {
        line.style.width = `${lineLength}px`;
        line.style.transition = 'width 0.3s ease-in-out';
    }, 0);
}

function refresh() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    render();
    currentPlayer = 'circle';
}