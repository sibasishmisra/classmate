# ClassMate.info

AI-powered educational explanations with a nostalgic school-themed interface. Built for students ages 9-14 worldwide.

## Features

- 🎓 Age-appropriate explanations for 6 learning levels (ages 9-14)
- 🤖 Powered by Anthropic Claude API
- 📚 Nostalgic school-themed design (chalkboard, notebook paper)
- 🌍 Globally accessible with culturally neutral content
- ♿ WCAG 2.1 AA accessible
- 📱 Mobile-first responsive design
- 🎨 Delightful micro-interactions and animations
- ⌨️ Keyboard shortcuts (Enter to submit, Shift+Enter for new line)
- 🔊 Optional sound effects (school bell, page turn, success chime)
- 📖 Comprehensive FAQ and help section

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom nostalgic design tokens
- **AI**: Anthropic Claude API
- **Animation**: Framer Motion
- **Testing**: fast-check (property-based testing)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Claude API key from Anthropic

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd classmate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Claude API key to `.env.local`:
```
CLAUDE_API_KEY=your_api_key_here
```

5. (Optional) Add sound files:
```bash
node setup-sounds.js
```
Follow the instructions to download free sound effects from Pixabay. See `SOUND_FILES_DOWNLOAD_INSTRUCTIONS.md` for details.

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:
```bash
npm run build
npm start
```

## Project Structure

```
classmate/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
├── public/               # Static assets
│   ├── textures/         # Chalkboard and paper textures
│   └── sounds/           # Sound effects
├── .kiro/                # Kiro spec files
└── README.md
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `node setup-sounds.js` - Check and setup sound files

## Environment Variables

See `.env.example` for all available environment variables.

Required:
- `CLAUDE_API_KEY` - Your Anthropic Claude API key

Optional:
- `NEXT_PUBLIC_MAX_TOPIC_LENGTH` - Maximum topic length (default: 500)
- `NEXT_PUBLIC_MAX_HISTORY_ENTRIES` - Maximum history entries (default: 10)
- `RATE_LIMIT_REQUESTS` - Rate limit requests per window (default: 10)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in ms (default: 60000)

## Design System

The application uses a nostalgic school-themed design system with:

- **Colors**: Chalkboard black, chalk white, paper cream, ink black
- **Fonts**: Lora (serif) for body text, DM Sans (sans-serif) for UI
- **Textures**: Chalkboard and notebook paper backgrounds
- **Animations**: Typewriter effects, page flips, chalk dust particles

## Deployment

Ready to deploy ClassMate.info to production?

**Quick Start**: See [Quick Deployment Guide](./DEPLOYMENT_QUICK_START.md) for 5-minute Vercel deployment.

**Full Guide**: See [Deployment Guide](./DEPLOYMENT.md) for comprehensive documentation including:

- Environment setup and API key configuration
- Step-by-step deployment instructions for:
  - **Vercel** (recommended)
  - **Netlify**
  - **Docker**
  - **Self-hosted** servers
- Post-deployment verification checklist
- Troubleshooting common issues
- Security best practices

Quick start for Vercel:
```bash
npm i -g vercel
vercel --prod
```

## License

ISC

## Contributing

This project follows a spec-driven development workflow. See `.kiro/specs/` for detailed requirements, design, and tasks.
