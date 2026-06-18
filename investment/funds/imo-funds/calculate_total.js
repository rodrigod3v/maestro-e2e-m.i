function parseCurrency(value) {
  if (!value) return 0;
  // Remove "R$ ", thousands separator (.), and replace decimal separator (,) with (.)
  let cleanValue = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(cleanValue) || 0;
}

// Access environment variable passed from the Flow
const tickerToFind = (typeof ticker !== 'undefined') ? ticker : 'PETR4';
let total = 0;

console.log('--- Dividend Calculation Script Started ---');
console.log('Target Ticker: ' + tickerToFind);

function findAll(node, predicate, results = []) {
  if (!node) return results;
  if (predicate(node)) {
    results.push(node);
  }
  if (node.children) {
    node.children.forEach(child => findAll(child, predicate, results));
  }
  return results;
}

const allTickers = findAll(maestro.hierarchy, n => n.id === 'dividend-card-ticker');
const allValues = findAll(maestro.hierarchy, n => n.id === 'dividend-card-value');

console.log('Found ' + allTickers.length + ' cards on screen.');

for (let i = 0; i < allTickers.length; i++) {
  const currentTicker = allTickers[i].text;
  if (currentTicker === tickerToFind) {
    if (allValues[i]) {
      const val = parseCurrency(allValues[i].text);
      console.log('  Matching card: ' + currentTicker + ' | Value: ' + allValues[i].text);
      total += val;
    }
  }
}

// Set outputs to be used in the Flow if needed
output.totalDividends = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
output.totalNumeric = total.toFixed(2);
output.ticker = tickerToFind;

console.log('Calculation complete. Total: ' + output.totalDividends);
console.log('--- Dividend Calculation Script Ended ---');
