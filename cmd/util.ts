import fs from 'fs';
import json2csv from 'json2csv';

export function toCSV(data: Array<any>, fileName: string) {
  const csv = json2csv.parse(data, { fields: Object.keys(data[0]) });
  fs.writeFileSync(fileName, csv);
  console.log('CSV written to', fileName);
}