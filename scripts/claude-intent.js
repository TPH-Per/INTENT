#!/usr/bin/env node
const { program } = require('commander');

program
  .version('1.0.0')
  .description('INTENT CLI — Human-to-Machine Intent Interface');

program
  .command('auth login')
  .description('OAuth browser login flow')
  .action(() => {
    console.log('Initiating OAuth login...');
  });

program
  .command('init')
  .description('Initialize project with intent templates')
  .action(() => {
    console.log('Select templates to initialize...');
  });

program
  .command('add <intent>')
  .description('Add a new intent using Natural Language')
  .option('-s, --scope <scope>', 'Scope (e.g. repo:auth-service)')
  .action((intent, options) => {
    console.log(`Adding intent: "${intent}" with scope ${options.scope}`);
  });

program
  .command('list')
  .description('List all registered intents')
  .option('--status <status>', 'Filter by status (gap, ok, paused)')
  .action((options) => {
    console.log(`Listing intents with status: ${options.status || 'all'}`);
  });

program
  .command('why <id>')
  .description('Explain why an intent has a gap (causal chain)')
  .action((id) => {
    console.log(`Reconstructing causal chain for intent ${id}...`);
  });

program
  .command('approve <actionId>')
  .description('Approve a pending agent action')
  .action((actionId) => {
    console.log(`Approving action ${actionId}...`);
  });

program.parse(process.argv);
