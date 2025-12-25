import chalk from 'chalk';

export function showSuccess(message: string): void {
  console.log(chalk.green('  ✓'), message);
}

export function showError(message: string): void {
  console.log(chalk.red('  ✗'), message);
}

export function showInfo(message: string): void {
  console.log(chalk.blue('  i'), message);
}

export function showWarning(message: string): void {
  console.log(chalk.yellow('  ⚠'), message);
}

export function showDivider(): void {
  console.log(chalk.dim('  ' + '─'.repeat(55)));
}
