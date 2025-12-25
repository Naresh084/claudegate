import chalk from 'chalk';

/**
 * Display the ClaudeGate banner
 */
export function showBanner(): void {
  console.log();
  console.log(
    chalk.cyan.bold('  ╔═══════════════════════════════════════════════════════╗')
  );
  console.log(
    chalk.cyan.bold('  ║') +
      chalk.white.bold('                     CLAUDEGATE                        ') +
      chalk.cyan.bold('║')
  );
  console.log(
    chalk.cyan.bold('  ╚═══════════════════════════════════════════════════════╝')
  );
  console.log();
}
