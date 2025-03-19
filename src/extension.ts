import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface PackageInstallEntry {
  packageName: string;
  packageManager: string;
  timestamp: string;
}

export function activate(context: vscode.ExtensionContext) {
  let cachedPackageManager: string | null = null;

  // Command to install a package
  let installCommand = vscode.commands.registerCommand('multipackinstaller.install', async () => {
    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = 'Search for a package (e.g., lodash)';
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;
    quickPick.canSelectMany = false;
    quickPick.ignoreFocusOut = true;

    quickPick.items = [{ label: 'Loading...', description: 'Initializing package search' }];
    quickPick.show();

    let debounce: NodeJS.Timeout | undefined;
    quickPick.onDidChangeValue(async (value) => {
      if (debounce) clearTimeout(debounce);

      debounce = setTimeout(async () => {
        if (value.length < 2) {
          quickPick.items = [];
          return;
        }

        quickPick.busy = true;
        try {
          const packages = await searchPackages(value);
          quickPick.items = packages.map(pkg => ({
            label: pkg.name,
            description: pkg.description,
            detail: `v${pkg.version} by ${pkg.publisher}`
          }));
        } catch (error) {
          quickPick.items = [{ label: 'Error', description: 'Failed to fetch packages. Try again.' }];
          console.error('Error fetching packages:', error);
        } finally {
          quickPick.busy = false;
        }
      }, 200);
    });

    const packageSelection = await new Promise<vscode.QuickPickItem | undefined>(resolve => {
      quickPick.onDidAccept(() => {
        const selected = quickPick.selectedItems[0];
        resolve(selected);
        quickPick.hide();
      });
      quickPick.onDidHide(() => resolve(undefined));
    });

    quickPick.dispose();

    let packageName: string | undefined;
    if (packageSelection) {
      packageName = packageSelection.label;
    } else {
      packageName = await vscode.window.showInputBox({
        prompt: 'Enter a custom package name',
        placeHolder: 'e.g., lodash'
      });
    }

    if (!packageName) {
      vscode.window.showErrorMessage('No package name provided!');
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('Please open a workspace folder first!');
      return;
    }

    if (!cachedPackageManager) {
      cachedPackageManager = await detectPackageManager(workspaceFolder);
    }
    const packageManager = cachedPackageManager;

    if (!packageManager) {
      vscode.window.showErrorMessage('No supported package manager detected!');
      return;
    }

    // Show the starting notification
    await new Promise<void>(resolve => {
      console.log(`Showing notification: Installing ${packageName} with ${packageManager}...`);
      vscode.window.showInformationMessage(`Installing ${packageName} with ${packageManager}...`, { modal: false });
      setTimeout(resolve, 1000);
    });

    // Install the package and store in history
    await installPackage(packageManager, packageName, workspaceFolder, context);
  });

  // Command to view installation history
  let viewHistoryCommand = vscode.commands.registerCommand('multipackinstaller.viewHistory', async () => {
    const history: PackageInstallEntry[] = context.globalState.get('packageInstallHistory', []);

    if (history.length === 0) {
      vscode.window.showInformationMessage('No package installation history found.');
      return;
    }

    const quickPick = vscode.window.createQuickPick();
    quickPick.items = history.map(entry => ({
      label: entry.packageName,
      description: `Installed with ${entry.packageManager}`,
      detail: `Installed on ${new Date(entry.timestamp).toLocaleString()}`
    }));
    quickPick.placeholder = 'Your recent package installations (up to 20)';
    quickPick.canSelectMany = false;
    quickPick.ignoreFocusOut = true;
    quickPick.show();

    await new Promise<void>(resolve => {
      quickPick.onDidHide(() => {
        quickPick.dispose();
        resolve();
      });
    });
  });

  context.subscriptions.push(installCommand, viewHistoryCommand);
}

export function deactivate() {}

async function searchPackages(query: string): Promise<any[]> {
  try {
    const response = await axios.get('https://api.npms.io/v2/search/suggestions', {
      params: {
        q: query,
        size: 10
      }
    });
    const data = response.data as { package: { name: string; description?: string; version: string; publisher?: { username: string } } }[];
    return data.map((pkg) => ({
      name: pkg.package.name,
      description: pkg.package.description || 'No description available',
      version: pkg.package.version,
      publisher: pkg.package.publisher?.username || 'Unknown'
    }));
  } catch (error) {
    throw new Error('Failed to fetch package suggestions');
  }
}

async function detectPackageManager(workspaceFolder: string): Promise<string | null> {
  const packageManagers = [
    { name: 'bun', check: () => checkCommand('bun --version'), installCmd: `bun add` },
    { name: 'pnpm', check: () => checkCommand('pnpm --version'), installCmd: `pnpm add` },
    { name: 'yarn', check: () => checkCommand('yarn --version'), installCmd: `yarn add` },
    { name: 'npm', check: () => checkCommand('npm --version'), installCmd: `npm install` },
    { name: 'deno', check: () => checkCommand('deno --version'), installCmd: `deno add` }
  ];

  const lockFiles = {
    'bun.lockb': 'bun',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
    'deno.json': 'deno'
  };

  for (const [lockFile, pm] of Object.entries(lockFiles)) {
    if (fs.existsSync(path.join(workspaceFolder, lockFile))) {
      return pm;
    }
  }

  for (const pm of packageManagers) {
    if (await pm.check()) {
      return pm.name;
    }
  }

  return 'npm';
}

function checkCommand(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    cp.exec(command, (err) => {
      resolve(!err);
    });
  });
}

async function installPackage(packageManager: string, packageName: string, cwd: string, context: vscode.ExtensionContext) {
  let installCmd: string;

  switch (packageManager) {
    case 'bun':
      installCmd = `bun add ${packageName}`;
      break;
    case 'pnpm':
      installCmd = `pnpm add ${packageName}`;
      break;
    case 'yarn':
      installCmd = `yarn add ${packageName}`;
      break;
    case 'npm':
      installCmd = `npm install ${packageName}`;
      break;
    case 'deno':
      vscode.window.showInformationMessage('Deno detected. Please add imports manually in your code.');
      appendDenoImport(packageName, cwd);
      return;
    default:
      vscode.window.showErrorMessage(`Unsupported package manager: ${packageManager}`);
      return;
  }

  // Show progress in the status bar
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Window,
    title: `Installing ${packageName} with ${packageManager}`,
    cancellable: false
  }, async (progress) => {
    return new Promise<void>(async (resolve, reject) => {
      progress.report({ message: 'Starting installation...' });
      cp.exec(installCmd, { cwd }, async (err, stdout, stderr) => {
        if (err) {
          progress.report({ message: 'Installation failed!' });
          console.log(`Error during installation: ${stderr}`);
          await new Promise<void>(resolve => {
            vscode.window.showErrorMessage(`Failed to install ${packageName} with ${packageManager}: ${stderr}`, { modal: false });
            setTimeout(resolve, 2000);
          });
          reject(err);
          return;
        }
        progress.report({ message: 'Installation complete!' });
        console.log(`Installation successful: ${packageName} with ${packageManager}`);

        // Store the package in history
        const history: PackageInstallEntry[] = context.globalState.get('packageInstallHistory', []);
        history.push({
          packageName,
          packageManager,
          timestamp: new Date().toISOString()
        });

        // Limit history to 20 entries
        if (history.length > 20) {
          history.shift(); // Remove the oldest entry
        }

        // Update global state
        await context.globalState.update('packageInstallHistory', history);

        await new Promise<void>(resolve => {
          vscode.window.showInformationMessage(`${packageName} installed successfully with ${packageManager}!`, { modal: false });
          setTimeout(resolve, 2000);
        });
        resolve();
      });
    });
  });
}

function appendDenoImport(packageName: string, cwd: string) {
  const denoJsonPath = path.join(cwd, 'deno.json');
  if (fs.existsSync(denoJsonPath)) {
    const denoJson = JSON.parse(fs.readFileSync(denoJsonPath, 'utf8'));
    denoJson.imports = denoJson.imports || {};
    denoJson.imports[packageName] = `npm:${packageName}`;
    fs.writeFileSync(denoJsonPath, JSON.stringify(denoJson, null, 2));
    vscode.window.showInformationMessage(`Added ${packageName} to deno.json imports.`);
  } else {
    vscode.window.showWarningMessage('No deno.json found. Please add the import manually.');
  }
}