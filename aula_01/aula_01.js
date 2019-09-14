//console.log(process.argv);

const p0 = { x: parseInt(process.argv[2], 10), y: parseInt(process.argv[3], 10) };
const p1 = { x: parseInt(process.argv[4], 10), y: parseInt(process.argv[5], 10) };

const m = parseInt(process.argv[6], 10);




// Ponto Médio
const pontoMedio = {
    x: ((p0.x + p1.x) / 2),
    y: ((p0.y + p1.y) / 2),
};

// Distancia
const distancia = Math.sqrt((p1.x - p0.x)*(p1.x - p0.x) + (p1.y - p0.y)*(p1.y - p0.y));

// Raio
const raio = distancia / 2;

console.log(`Ponto Médio: ${pontoMedio.x},${pontoMedio.y}`);

console.log(`Distância Entre os 2 Pontos: ${distancia}`);

console.log(`Raio: ${raio}`);

console.log(`\nTabela:`);

for(let i = 0; i < m; i++) {
    const pontoX = raio * Math.cos((i / m) * 2 * Math.PI) + pontoMedio.x;
    const pontoY = raio * Math.sin((i / m) * 2 * Math.PI) + pontoMedio.y;
    console.log(`${pontoX.toFixed(2)} | ${pontoY.toFixed(2)}`);
}