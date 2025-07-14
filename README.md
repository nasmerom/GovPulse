# GovPulse

A comprehensive political intelligence platform that provides real-time insights into government activities, legislation, and political events for citizens, organizations, and representatives.

## Features

### Multi-Role Dashboard System
- **Citizen Dashboard**: Local issues, representatives, and community updates
- **Organization Dashboard**: Market impact analysis, regulatory tracking, and industry trends
- **Representative Dashboard**: Constituent correspondence, voting analytics, and strategic insights

### Key Components
- Real-time political event tracking
- Live vote tallies and bill monitoring
- Constituent correspondence management
- Economic indicators and market impact analysis
- AI-powered search and analytics
- Committee tracking and member hierarchies
- Robust error handling and user-friendly error messages

## Project Structure

```
GovPulse/
├── entities/                 # Data models and schemas
│   ├── User.js              # User entity with authentication
│   ├── PoliticalEvent.json  # Political event schema
│   ├── Politician.json      # Politician entity schema
│   └── ...                  # Additional entity schemas
├── pages/                   # Main application pages
│   └── DashboardRouter.jsx  # Main dashboard router
├── components/              # React components
│   ├── dashboards/          # Dashboard components
│   │   ├── CitizenDashboard.jsx
│   │   ├── OrganizationDashboard.jsx
│   │   └── RepresentativeDashboard.jsx
│   ├── onboarding/          # Onboarding components
│   │   ├── AddressCollection.jsx
│   │   └── RepresentativeSetup.jsx
│   ├── dashboard/           # Shared dashboard components
│   │   └── KeyMetrics.jsx
│   └── ui/                  # UI components (to be added)
├── utils/                   # Utility functions
│   └── fetchWithError.js    # Consistent fetch error handling
├── integrations/            # API integrations
└── Layout.js               # Main layout component
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GovPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration (API keys, etc.)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Technology Stack

- **Frontend**: React 18, Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Type Safety**: TypeScript (optional)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

The application follows a component-based architecture with:

- **Entities**: Data models and business logic
- **Pages**: Route-level components
- **Components**: Reusable UI components
- **Utils**: Helper functions and utilities

### Error Handling

- All data fetching uses `utils/fetchWithError.js` for consistent, user-friendly error messages.
- UI components display clear loading and error states for all async operations.
- Mock data is clearly marked in the UI and will be replaced as real APIs are integrated.

### Mock Data

- Some entities and API routes use mock data for development and demo purposes.
- All mock data is clearly marked in the code and UI.
- To switch to real data, update the relevant entity/API files and integrations.

### Adding New Features

1. **Create entity schemas** in `entities/` directory
2. **Add new pages** in `pages/` directory
3. **Create components** in appropriate `components/` subdirectories
4. **Update routing** in `DashboardRouter.jsx`

## API Integration

- The current implementation uses mock data in some areas. To integrate with real APIs:
  1. Replace mock implementations in entity classes and API routes
  2. Add API client configuration in `integrations/`
  3. Update components to handle real data loading states
  4. Implement error handling and retry logic

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **AWS**: Use AWS Amplify or custom deployment
- **Docker**: Create Dockerfile for containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## Roadmap & TODO (Post-Trial)

- [ ] Replace all mock data with real API integrations
- [ ] Polish all loading and error states in the UI
- [ ] Complete accessibility audit and improvements
- [ ] Add more unit and integration tests
- [ ] Optimize performance (API batching, memoization, etc.)
- [ ] Finalize mobile responsiveness and cross-browser support
- [ ] Harden authentication and security
- [ ] Add user documentation and onboarding guides
- [ ] Prepare for production deployment (Vercel, Netlify, or Docker)
- [ ] Review and refactor for code quality and maintainability 