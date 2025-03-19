# Change Log

All notable changes to the "multipackinstaller" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1] - 2025-03-19
### Fixed
- Fixed package manager detection to prioritize npm when a `package.json` exists but no lock file is present.

## [1.0.0] - 2025-03-18
### Added
- Initial release of MultiPackInstaller with support for npm, Yarn, Bun, pnpm, and Deno.
- Dynamic package search using the npm registry.
- Package installation history (up to 20 packages).