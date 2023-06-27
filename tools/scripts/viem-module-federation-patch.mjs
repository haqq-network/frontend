#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

async function main() {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const sourcePackageFilePath = resolve(
      __dirname,
      '../../node_modules/viem/package.json',
    );
    const targetPackageFilePath = resolve(
      __dirname,
      '../../node_modules/viem/dist/esm/package.json',
    );
    const sourcePackageData = await readFile(sourcePackageFilePath);
    const viemPackage = JSON.parse(sourcePackageData);
    const targetPackageData = await readFile(targetPackageFilePath);
    const targetViemPackage = JSON.parse(targetPackageData);
    const newPackage = {
      ...targetViemPackage,
      version: viemPackage.version,
    };

    await writeFile(targetPackageFilePath, JSON.stringify(newPackage, null, 2));
  } catch (err) {
    console.log(err);
  }
}

main();
