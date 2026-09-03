import { TaskCLI } from './cli.js';

const cli = new TaskCLI();
cli.start().catch(err => {
  console.error('Fatal error running Task Manager CLI:', err);
  process.exit(1);
});
