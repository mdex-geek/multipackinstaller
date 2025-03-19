# MultiPackInstaller - The Ultimate Package Manager for VS Code ✨

Welcome to **MultiPackInstaller**, the revolutionary Visual Studio Code extension that transforms package installation across multiple runtimes! Whether you're using npm, Yarn, Bun, pnpm, or Deno, this extension streamlines your workflow with intelligent detection and a powerful search feature. Say goodbye to manual terminal hassles and hello to a seamless development experience right in your editor. 🚀

## Why Choose MultiPackInstaller? 🎯

- **Multi-Runtime Support**: Automatically detects and uses npm, Yarn, Bun, pnpm, or Deno based on your project setup.
- **Dynamic Package Search**: Search for packages in real-time with a smart, searchable dropdown powered by the npm registry.
- **Blazing Fast Performance**: Optimized with caching and debouncing for a snappy user experience.
- **Package Installation History**: Keep track of up to your last 20 installed packages with details like package name, manager, and timestamp.
- **Cross-Platform Ready**: Works flawlessly on Windows, macOS, and Linux.
- **Open Source & Community-Driven**: Join a growing community of developers enhancing this tool!

With MultiPackInstaller, you’ll save time, reduce errors, and focus on building incredible projects. 🌟

## Features 🌈

- **Smart Detection**: Identifies your preferred package manager (e.g., via `package-lock.json`, `yarn.lock`, or global availability) with cached results for faster subsequent runs.
- **Interactive Search**: Type to search for packages (e.g., "lodash", "react") and see real-time suggestions with descriptions and versions, enhanced with debouncing for smooth performance.
- **Custom Input**: Enter any package name manually if it’s not in the search results.
- **Deno Support**: Special handling for Deno projects with import suggestions in `deno.json`.
- **Performance Optimization**: Features caching of package manager detection and search results to minimize delays.
- **Installation History**: View a history of your last 20 package installations, including the package name, package manager, and installation date.

## Installation 📦

Getting started is a breeze! Follow these steps to install MultiPackInstaller:

1. **Open VS Code**.
2. Go to the Extensions view by clicking the Extensions icon in the Sidebar or pressing `Ctrl+Shift+X` (Windows/Linux) / `Cmd+Shift+X` (macOS).
3. Search for **"MultiPackInstaller"** in the Marketplace.
4. Click **Install** and reload VS Code when prompted.

Alternatively, if you’re a developer who loves the cutting edge:
- Clone this repository: `git clone https://github.com/mdex-geek/multipackinstaller.git`
- Open the folder in VS Code and run `npm install` followed by `npm run compile`.
- Press `F5` to launch the Extension Development Host and test it locally.

## Usage 🚀

### Install a Package
1. **Open the Command Palette**:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).

2. **Run the Command**:
   - Type **"MultiPackInstaller: Install Package"** and select it.

3. **Search for a Package**:
   - Start typing a package name (e.g., "lodash" or "express").
   - Browse the dynamic suggestions, complete with descriptions and versions.

4. **Install**:
   - Select a package or enter a custom name, then press Enter.
   - MultiPackInstaller handles the installation seamlessly based on your detected runtime!

5. **Enjoy the Result**:
   - Check your project’s `node_modules` or lock file to confirm the installation.

### View Installation History
1. **Open the Command Palette**:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).

2. **Run the Command**:
   - Type **"MultiPackInstaller: View Package Installation History"** and select it.

3. **Browse Your History**:
   - See a list of your last 20 installed packages, including the package name, package manager, and installation date.

### Example Workflow
Need `chalk` for terminal styling?
- Open Command Palette → Type "MultiPackInstaller: Install Package" → Search "chalk" → Select it → Done!
- MultiPackInstaller takes care of the rest, whether you’re using npm, Yarn, or another runtime.
- Later, check your history to see when and how `chalk` was installed!

## Contributing 🤝

We’d love for you to join our journey! Here’s how you can contribute:

- **Report Bugs**: Found an issue? Open an issue on our [GitHub Issues](https://github.com/mdex-geek/multipackinstaller/issues) page.
- **Suggest Features**: Have an idea? Share it with us!
- **Code Contributions**: Fork the repo, make your changes, and submit a pull request. Please follow our [Contributing Guidelines](CONTRIBUTING.md) (coming soon!).
- **Spread the Word**: Star this repo and tell your developer friends about MultiPackInstaller!

## Support & Feedback 🙋‍♂️

Have questions or need help? Reach out to us:
- **GitHub Issues**: [https://github.com/mdex-geek/multipackinstaller/issues](https://github.com/mdex-geek/multipackinstaller/issues)
- **Twitter**: Follow [@deepanshugar](https://twitter.com/deepanshugar) for updates.

Your feedback is invaluable—it helps us make MultiPackInstaller even better!

## License 📜

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as you see fit, as long as you include the original license.

## Acknowledgments 🙏

- Built with ❤️ using the VS Code Extension API.
- Special thanks to the open-source community and the npms.io API for powering our package search.

---

### Get Started Today! 🎉
Don’t wait—install **MultiPackInstaller** now and revolutionize your development workflow. Your projects deserve the best, and we’re here to deliver it. Happy coding! 💻

[Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Deepanshugarg.multipackinstaller)  
[GitHub Repository](https://github.com/mdex-geek/multipackinstaller)
