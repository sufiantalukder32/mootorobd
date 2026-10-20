const { spawn } = require('child_process');

const command = process.argv[2] || 'start';
const script = require.resolve(`react-scripts/scripts/${command}`);
const extraArgs = process.argv.slice(3);

if (command === 'test' && !extraArgs.includes('--watchAll') && extraArgs.includes('--watchAll=false') === false) {
  extraArgs.unshift('--watchAll=false');
}

const child = spawn(process.execPath, [script, ...extraArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    BROWSER: process.env.BROWSER || 'none',
    CI: command === 'test' ? process.env.CI || 'true' : process.env.CI,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--openssl-legacy-provider'].filter(Boolean).join(' '),
  },
});

child.on('exit', (code) => process.exit(code == null ? 1 : code));
