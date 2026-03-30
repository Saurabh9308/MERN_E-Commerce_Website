import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handling __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputFile = path.join(__dirname, 'products.json'); // Your source file
const outputFile = path.join(__dirname, 'sorted_products.json');

try {
  // 1. Read and parse the JSON
  const rawData = fs.readFileSync(inputFile, 'utf8');
  let products = JSON.parse(rawData);

  // 2. Sort the data by 'id'
  // localeCompare with numeric: true ensures "prod-2" < "prod-10"
  products.sort((a, b) => {
    return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
  });

  // 3. Save the sorted data
  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));

  console.log(`✅ Success! Data sorted and saved to ${outputFile}`);
} catch (error) {
  console.error('❌ Error processing file:', error.message);
}