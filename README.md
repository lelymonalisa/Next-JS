# Next.js Project Setup

## Prerequisites
- Node.js version >= v18.17.0 (required for Next.js 14)

## 1. Create Next.js 14 Application
```bash
npx create-next-app@14 front
```

## 2. Node.js Version Management

### Check Current Node Version
```bash
node --version
```

### Install/Update Node.js using NVM (Recommended)

#### Install NVM (if not already installed)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### Restart Terminal or Source Profile
```bash
# For bash
source ~/.bashrc

# For zsh (default on newer macOS)
source ~/.zshrc
```

#### Install and Use Node.js v18
```bash
# Install latest Node.js v18
nvm install 18

# Use Node.js v18
nvm use 18

```

#### Verify Installation
```bash
node --version  # Should show >= v18.17.0
```

## 3. Run Development Server
```bash
cd front
npm run dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting
- If you encounter Node.js version errors, ensure you're using Node.js >= v18.17.0
- Restart your terminal after installing NVM
- Use `nvm list` to see installed Node.js versions