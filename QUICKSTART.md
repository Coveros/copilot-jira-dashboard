# 🚀 Quick Start Guide

This guide will help you get started with the Copilot-Jira Dashboard, whether you're using GitHub Codespaces, VS Code locally, or just the command line.

## 🌐 Option 1: GitHub Codespaces (Recommended)

The easiest way to get started is with GitHub Codespaces. The repository includes a complete devcontainer configuration.

### Starting a Codespace

1. Click the **Code** button on the GitHub repository
2. Select the **Codespaces** tab
3. Click **Create codespace on main** (or your branch)

The Codespace will automatically:
- Set up a Node.js 22 development environment
- Install all dependencies (`npm install`)
- Configure recommended VS Code extensions
- Forward port 5173 for the Vite dev server

### Using VS Code Tasks in Codespaces

Once your Codespace is ready, use VS Code tasks to build and run the application:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Tasks: Run Task"
3. Select from available tasks:
   - **Dev Server** - Start the development server (default build task)
   - **Build** - Build the production bundle
   - **Lint** - Run ESLint to check code quality
   - **Preview** - Preview the production build
   - **Install Dependencies** - Reinstall npm packages
   - **Clean** - Remove dist and node_modules folders

**Keyboard Shortcuts:**
- `Ctrl+Shift+B` (or `Cmd+Shift+B`) - Run the default build task (Dev Server)

### Accessing the Application

When you run the **Dev Server** task, VS Code will automatically notify you that port 5173 has been forwarded. Click the notification to open the application in your browser.

You can also:
1. Go to the **Ports** tab in VS Code
2. Find port 5173 (labeled "Vite Dev Server")
3. Click the globe icon to open in browser

## 💻 Option 2: Local Development with VS Code

If you prefer to develop locally, you can still use the same VS Code tasks.

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- VS Code with recommended extensions

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Coveros/copilot-jira-dashboard.git
   cd copilot-jira-dashboard
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Install recommended extensions**
   When VS Code opens, you'll see a notification to install recommended extensions. Click **Install All** to get:
   - ESLint
   - Prettier
   - GitHub Copilot
   - GitHub Copilot Chat
   - TypeScript support
   - React snippets

4. **Install dependencies**
   Run the "Install Dependencies" task or:
   ```bash
   npm install
   ```

### Using VS Code Tasks Locally

Use the same tasks as described in the Codespaces section above. All tasks work identically in local VS Code.

### Debugging

The repository includes launch configurations for debugging:

1. Start the **Dev Server** task first
2. Press `F5` or go to Run and Debug panel
3. Select **Launch Chrome against localhost**
4. Set breakpoints in your code and debug!

## 🖥️ Option 3: Command Line

If you prefer the command line, here are the essential commands:

### Installation

```bash
git clone https://github.com/Coveros/copilot-jira-dashboard.git
cd copilot-jira-dashboard
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

```bash
# Type-check and build for production
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

### Linting

```bash
# Check code quality with ESLint
npm run lint
```

## 📦 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite development server with hot reload |
| `build` | `npm run build` | Type-check with TypeScript and build for production |
| `lint` | `npm run lint` | Run ESLint to check code quality |
| `preview` | `npm run preview` | Preview production build locally |

## 🔧 VS Code Tasks Reference

| Task | Description | Keyboard Shortcut |
|------|-------------|-------------------|
| Dev Server | Start development server | `Ctrl+Shift+B` (default) |
| Build | Build production bundle | - |
| Lint | Run ESLint | - |
| Preview | Preview production build | - |
| Install Dependencies | Run npm install | - |
| Clean | Remove dist and node_modules | - |

## 🎯 Next Steps

Once you have the application running:

1. Open your browser to `http://localhost:5173`
2. Explore the dashboard and interactive charts
3. Check out the code in the `src/` directory
4. Make changes and see them update live!

## 📚 Additional Resources

- [Main README](./README.md) - Project overview and features
- [Dashboard Documentation](./DASHBOARD_README.md) - Detailed dashboard documentation
- [Vite Documentation](https://vitejs.dev/) - Learn about the build tool
- [React Documentation](https://react.dev/) - Learn about React

## 🆘 Troubleshooting

### Port 5173 is already in use

If you see an error that port 5173 is in use:

```bash
# Kill the process using the port (Linux/Mac)
lsof -ti:5173 | xargs kill -9

# Or let Vite use a different port
npm run dev -- --port 5174
```

### Dependencies won't install

Try clearing npm cache and reinstalling:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Codespace is slow

If your Codespace feels slow:
1. Try stopping and restarting it
2. Check if background tasks are running
3. Consider upgrading to a machine with more resources

## 💡 Tips

- Use **GitHub Copilot** in VS Code to help write code and understand the project
- Run the **Lint** task before committing to catch issues early
- Use the **Clean** task if you need to do a fresh installation
- The dev server includes Hot Module Replacement (HMR) - changes appear instantly!
