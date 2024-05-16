import * as dfd from 'danfojs-node';
import { type CsvInputOptionsNode } from 'danfojs-node/dist/danfojs-base/shared/types';
import path from 'path';
import { exit } from 'process';

import { TEST_FILE_ROOT } from './conf';

const CSV_FILE = path.resolve(TEST_FILE_ROOT, 'iris.csv');

async function main(): Promise<void> {
  console.log(`To load data from ${CSV_FILE}`);

  // https://www.papaparse.com/docs#config
  const options = {
    header: true,
    dynamicTyping: true
  } as unknown as CsvInputOptionsNode;

  const df = await dfd.readCSV(CSV_FILE, options).catch(e => {
    console.error(e);
    exit(1);
  });

  df.head().print();
}

main().catch(err => {
  console.error(err);
  exit(1);
});
