import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = (yargs(hideBin(process.argv)).argv) as any;

console.log(`argv.env: ${argv.env}`);