# Free Rider HD — Offline Editor (FRHD_OEP)

> An offline track editor for [Free Rider HD](https://www.freeriderhd.com), allowing users to create, edit, import, and export custom bike tracks without requiring an internet connection.

⚠️ **This project is in alpha.** Expect bugs and incomplete features.

---

## Features

- 🎨 **Track Drawing** — Straight lines, curves, and brush tools
- 🏍️ **Vehicle Testing** — Play your track with MTB or BMX directly in the editor
- 📦 **Import / Export** — Load and save tracks as track code
- ⌨️ **Keyboard Shortcuts** — Full set of editor and play hotkeys
- 🔌 **Offline First** — Works without an internet connection
- 💾 **Auto-Save** — Automatically saves your work to localStorage every 30 seconds
- 🔄 **Crash Recovery** — Recovers your last track if the app closes unexpectedly
- ⚡ **Fast Offline Start** — Assets time out in 5 seconds offline (vs. 5 minutes online)
- 📡 **Connectivity Awareness** — Notifies you when going online/offline

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari)
- [Node.js](https://nodejs.org) v16+ (for development tooling only)

### Installation

```bash
# Clone the repository
git clone https://github.com/E1H16/FRHD_OEP.git
cd FRHD_OEP

# Install development dependencies
npm install
```

### Running Locally

Open `index.html` in your browser, or use a local development server:

```bash
npx serve .
```

### Development

```bash
# Lint the codebase
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix
```

## Project Structure

```
FRHD_OEP/
├── game.js             # Core game engine (physics, rendering, vehicles)
├── offlineeditor.js    # React-based track editor UI
├── settings.js         # Game configuration and defaults
├── manifest.js         # Asset manifest (images, sounds)
├── logger.js           # Conditional logging utility
├── trackValidator.js   # Track code validation & sanitization
├── errorHandler.js     # Error handling utilities (storage, files, network)
├── preferences.js      # User preference persistence
├── offlineReady.js     # Offline detection, auto-save & crash recovery
├── package.json        # Node.js project metadata & dev dependencies
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier formatting rules
└── .github/
    └── workflows/
        └── ci.yml      # GitHub Actions CI pipeline
```

## Keyboard Shortcuts

### Editor Mode

| Action        | Key   |
| ------------- | ----- |
| Straight Line | Q     |
| Brush         | A     |
| Curve         | W     |
| Eraser        | E     |
| Grid Toggle   | G     |
| Camera Mode   | C     |
| Snap          | Ctrl  |
| Line Type     | S     |
| Play / Pause  | Space |
| Undo          | Z     |
| Redo          | Y     |

### Play Mode

| Action         | Key         |
| -------------- | ----------- |
| Accelerate     | ↑ / W       |
| Brake          | ↓ / S       |
| Lean Left      | ← / A       |
| Lean Right     | → / D       |
| Restart        | R           |
| Change Vehicle | V           |
| Pause          | Space       |
| Turn Around    | Z           |

## Configuration

Game settings can be adjusted in `settings.js`. Key configuration areas:

- **Rendering**: `drawFPS`, `width`, `height`, `lowQualityMode`
- **Physics**: `defaultGravityX`, `defaultGravityY`, `physicsSectorSize`
- **Camera**: `cameraStartZoom`, `cameraZoomMin`, `cameraZoomMax`
- **Tools**: `toolHandler` (grid, snap, line type)
- **Controls**: `playHotkeys`, `editorHotkeys`
- **Offline**: `offlineMode`, `autoSaveEnabled`, `autoSaveIntervalMs`

## Known Limitations (Alpha)

The following features are still in development:

- [ ] Checkpoints
- [ ] Zoom to mouse cursor
- [ ] Redo & Undo (partially implemented)
- [ ] Tablet / touch controls
- [ ] Track uploading
- [ ] Fullscreen mode
- [ ] Sound effects

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and ensure linting passes: `npm run lint`
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Open a Pull Request

## License

This project is provided as-is for educational and personal use. See the repository for license details.
