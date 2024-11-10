const table1 = document.getElementById('table1').querySelector('tbody');
const table2 = document.getElementById('table2').querySelector('tbody');
const table3 = document.getElementById('table3').querySelector('tbody');

const addRow1 = document.getElementById('addRow1');
const addRow2 = document.getElementById('addRow2');
const calculateButton = document.getElementById('calculate');

const canvas1 = document.getElementById('chart1')
const canvas2 = document.getElementById('chart2')
const canvas3 = document.getElementById('chart3')

const chart1 = document.getElementById('chart1').getContext('2d');
const chart2 = document.getElementById('chart2').getContext('2d');
const chart3 = document.getElementById('chart3').getContext('2d');

function addRow(table) {
    const row = table.insertRow();
    for (let i = 0; i < 2; i++) {
        cellElem(row.insertCell(), '')
    }

    const deleteCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => row.remove();
    deleteCell.appendChild(deleteButton);
}

function cellElem(cell, sum) {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = sum;
    if (sum !== '') {
        input.setAttribute('disabled', true)
    }
    cell.appendChild(input);
}

addRow1.addEventListener('click', () => addRow(table1));
addRow2.addEventListener('click', () => addRow(table2));
addRow(table1)
addRow(table2)

calculateButton.addEventListener('click', () => {
    const rows1 = Array.from(table1.rows);
    const rows2 = Array.from(table2.rows);

    const minLength = Math.min(rows1.length, rows2.length);

    table3.innerHTML = '';

    for (let i = 0; i < minLength; i++) {
        const row1Cells = rows1[i].getElementsByTagName('input');
        const row2Cells = rows2[i].getElementsByTagName('input');

        const x1 = parseFloat(row1Cells[0].value);
        const y1 = parseFloat(row1Cells[1].value);
        const x2 = parseFloat(row2Cells[0].value);
        const y2 = parseFloat(row2Cells[1].value);

        const row = table3.insertRow();
        const xCell = row.insertCell();
        cellElem(xCell, ((x1 + x2) / 2).toFixed(2))
        const yCell = row.insertCell();
        cellElem(yCell, ((y1 + y2) / 2).toFixed(2))
    }

    drawChart(chart1, rows1);
    drawChart(chart2, rows2);
    drawChart(chart3, Array.from(table3.rows));
    drawTextInCorner('First', canvas1, chart1)
    drawTextInCorner('Second', canvas2, chart2)
    drawTextInCorner('General', canvas3, chart3)
});

function drawChart(ctx, rows) {
    ctx.clearRect(0, 0, 400, 400);

    let maxX = 0;
    let maxY = 0;
    rows.forEach((row) => {
        const x = parseFloat(row.cells[0].getElementsByTagName('input')[0].value);
        const y = parseFloat(row.cells[1].getElementsByTagName('input')[0].value);
        if (Math.abs(x) > maxX) maxX = Math.abs(x);
        if (Math.abs(y) > maxY) maxY = Math.abs(y);
    });
    let max = Math.max(maxX, maxY)
    const scaleX = max > 0 ? 100 / max : 1;
    const scaleY = max > 0 ? 150 / max : 1;

    drawAxes(ctx);
    ctx.beginPath();
    ctx.moveTo(150, 200);

    rows.forEach((row) => {
        const x = parseFloat(row.cells[0].getElementsByTagName('input')[0].value);
        const y = parseFloat(row.cells[1].getElementsByTagName('input')[0].value);

        const px = 150 + x * scaleX;
        const py = 200 - y * scaleY;

        ctx.lineTo(px, py);
    });
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function drawAxes(ctx) {
    // ось X
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(350, 200);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    // ось Y
    ctx.beginPath();
    ctx.moveTo(150, 50);
    ctx.lineTo(150, 350);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    // ось X
    for (let i = 1; i <= 14; i++) {
        ctx.beginPath();
        ctx.moveTo(50 + i * 20, 205);
        ctx.lineTo(50 + i * 20, 195);
        ctx.stroke();
    }
    // ось Y
    for (let i = 1; i <= 14; i++) {
        ctx.beginPath();
        ctx.moveTo(145, 340 - i * 20);
        ctx.lineTo(155, 340 - i * 20);
        ctx.stroke();
    }
}
function drawTextInCorner(text, canvas, ctx) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    const x = canvasWidth - 10 - ctx.measureText(text).width;
    const y = canvasHeight - 10;
    ctx.fillText(text, x, y);
}
calculateButton.click()



// изменение ширины канваса
function adjustCanvasSize(canvas, width) {
    canvas.addEventListener('wheel', function (event) {
        event.preventDefault();
        console.log(event);
        if (event.deltaY > 0) {
            if (width >= 33) {
                width -= 3;
                console.log(width);
                canvas.style.width = `${width}%`;
                canvasSize();
            }
        } else {
            if (width <= 97) {
                width += 3;
                console.log(width);
                canvas.style.width = `${width}%`;
                canvasSize();
            }
        }
    });
}

function canvasSize() {
    [canvas1, canvas2, canvas3].forEach(canvas => {
        canvas.style.height = `${canvas.clientWidth}px`;
    });
}

let width1 = 30, width2 = 30, width3 = 30;

adjustCanvasSize(canvas1, width1);
adjustCanvasSize(canvas2, width2);
adjustCanvasSize(canvas3, width3);