# Schwab Options Chain Viewer

## Introduction

This project implements a modern web interface for viewing options chain data from Charles Schwab's Developer API. Built with React, TypeScript, and Vite, it demonstrates a production-ready approach to OAuth2 authentication and real-time financial data visualization. The application showcases best practices in frontend development while providing a practical tool for options traders and developers interested in financial market data integration.

## Technical Architecture

The application is structured around several core technologies, each chosen for specific advantages they bring to the project. At its foundation, Vite serves as our build tool and development server, offering superior performance through its native ES modules approach and instant hot module replacement. React and TypeScript form the core of our frontend, providing a robust type system and component-based architecture that scales well with application complexity.

Authentication is handled through OAuth 2.0's three-legged flow, a security standard required by Schwab's API. This implementation demonstrates proper token management, secure state handling, and callback processing - all crucial elements in modern API authentication. The authentication flow is managed through a dedicated service that handles token refresh and storage, ensuring a seamless user experience while maintaining security best practices.

For the user interface, we utilize shadcn/ui components, which offer a sophisticated design system built on top of Radix UI primitives. This choice provides accessible, customizable components that maintain consistency while allowing for extensive styling through Tailwind CSS. The component library is particularly well-suited for displaying financial data, offering tables, cards, and form elements that can be customized to match any design requirements.

## Project Structure

```
.
├── dist/                   # Build output directory
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/                   
│   ├── assets/            # Project assets
│   │   └── react.svg      # React logo
│   ├── components/        # React components
│   │   ├── Callback.tsx   # OAuth callback handler
│   │   └── ui/           # UI components
│   │       ├── alert.tsx  # Alert component
│   │       ├── button.tsx # Button component
│   │       ├── card.tsx   # Card component
│   │       └── input.tsx  # Input component
│   ├── config/            # Configuration files
│   │   └── auth.ts       # Authentication configuration
│   ├── lib/               # Utility libraries
│   │   └── utils.ts      # Common utilities
│   ├── services/          # Service layer
│   │   └── auth.ts       # Authentication service
│   ├── App.css           # Application styles
│   ├── App.tsx           # Main application component
│   ├── env.d.ts          # Environment type declarations
│   ├── index.css         # Global styles
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite environment types
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── .nvmrc                # Node version specification
├── README.md             # Project documentation
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.app.json     # TypeScript app configuration
├── tsconfig.json         # TypeScript base configuration
├── tsconfig.node.json    # TypeScript node configuration
└── vite.config.ts        # Vite configuration
```

This structure follows a modular organization where:
- Components are organized by feature and type
- Configuration is centralized in the config directory
- Services handle external interactions and business logic
- UI components are isolated in their own directory
- Type definitions are properly separated
- Build and configuration files are at the root level

## Getting Started

Starting with this project requires some initial setup, particularly regarding API credentials and environment configuration. First, you'll need to create a developer account with Charles Schwab and register your application to obtain the necessary credentials. These credentials should be stored in environment variables to maintain security and flexibility across different deployment environments.

Create a `.env` file in your project root with the following structure:
```
VITE_SCHWAB_CLIENT_ID=your_client_id_here
VITE_SCHWAB_CLIENT_SECRET=your_client_secret_here
```

To install dependencies and start the development server:
```bash
npm install
npm run dev
```

## Authentication Flow

Understanding the OAuth flow is crucial for working with this application. When a user first attempts to fetch options data, they're redirected to Schwab's authentication endpoint. This begins the three-legged OAuth flow:

1. The application redirects to Schwab's authorization server with the client ID and requested scopes.
2. After user authentication, Schwab redirects back to our application's callback URL with an authorization code.
3. Our application exchanges this code for access and refresh tokens.

This process is handled automatically by our authentication service, which also manages token refresh when needed. The implementation follows OAuth 2.0 best practices, including state parameter validation to prevent CSRF attacks and secure token storage.

## Deployment

This application is designed to be deployed on AWS Amplify, which provides several advantages for hosting React applications. Amplify handles SSL certificate management, domain configuration, and continuous deployment from your GitHub repository. When deploying, ensure your environment variables are properly configured in the Amplify Console.

The callback URL configuration is particularly important. In the Schwab developer portal, you'll need to configure the callback URL to match your deployed domain (e.g., `https://schwab.yourdomain.com/callback`). This same URL should be reflected in your application's configuration.

### Deploying to a Custom Domain

Follow these steps to deploy this application to your own domain (e.g., incremental.capital):

1. **Fork and Clone the Repository**
   ```bash
   git clone [your-forked-repo-url]
   cd scwhab-api-client
   npm install
   ```

2. **Set Up Schwab Developer Account**
   - Register at the Charles Schwab Developer Portal
   - Create a new application
   - In the application settings, set the callback URL to your domain:
     ```
     https://your-subdomain.your-domain.com/callback
     ```
     For example: `https://schwab.incremental.capital/callback`

3. **Create AWS Amplify App**
   - Log into AWS Console and go to AWS Amplify
   - Click "New App" → "Host Web App"
   - Connect to your GitHub repository
   - Choose your main/master branch for deployment

4. **Configure Environment Variables**
   In AWS Amplify's Environment Variables section, add:
   ```
   VITE_SCHWAB_CLIENT_ID=[Your Schwab Client ID]
   VITE_SCHWAB_CLIENT_SECRET=[Your Schwab Client Secret]
   ```

5. **Configure Custom Domain**
   - In AWS Amplify Console, go to "Domain Management"
   - Click "Add Domain"
   - Enter your domain (e.g., incremental.capital)
   - Add your subdomain (e.g., schwab)
   - Follow AWS's instructions to verify domain ownership and update DNS records
   - Wait for SSL certificate provisioning (can take up to 24 hours)

6. **Update Application Configuration**
   Modify `src/config/auth.ts`:
   ```typescript
   export const AUTH_CONFIG = {
     clientId: import.meta.env.VITE_SCHWAB_CLIENT_ID as string,
     clientSecret: import.meta.env.VITE_SCHWAB_CLIENT_SECRET as string,
     redirectUri: 'https://schwab.incremental.capital/callback', // Update this
     authorizationEndpoint: 'https://api.schwabapi.com/oauth/authorize',
     tokenEndpoint: 'https://api.schwabapi.com/oauth/token',
     apiEndpoint: 'https://api.schwabapi.com/marketdata/v1',
     scope: 'marketdata'
   };
   ```

7. **Commit and Deploy**
   ```bash
   git add src/config/auth.ts
   git commit -m "Update domain configuration"
   git push
   ```
   AWS Amplify will automatically deploy your changes.

8. **Verify the Deployment**
   - Visit your domain (e.g., `https://schwab.incremental.capital`)
   - Test the OAuth flow by entering a ticker symbol
   - Verify that the callback successfully returns to your domain
   - Check that options chain data is being retrieved correctly

9. **Update Schwab Developer Portal**
   - If needed, update the callback URL in your Schwab developer account to match your new domain
   - Ensure all OAuth settings match between your application and Schwab's portal

10. **Troubleshooting**
    - Check AWS Amplify build logs for any deployment issues
    - Verify SSL certificate status in AWS Certificate Manager
    - Ensure DNS records are properly propagated
    - Monitor the browser console for any JavaScript errors
    - Verify environment variables are correctly set in Amplify

Note: Remember to keep your client ID and secret secure and never commit them to the repository. Always use environment variables for sensitive credentials.

## Development Considerations

When developing locally, you'll want to understand a few key aspects of the application structure. The project uses a modular architecture where authentication, API calls, and UI components are separated into distinct concerns. This separation makes the code more maintainable and easier to test.

Type safety is enforced throughout the application using TypeScript. This is particularly important when dealing with financial data, where accuracy is crucial. The types for API responses and internal state management are carefully defined to ensure data consistency.

The user interface is built with accessibility in mind, following WCAG guidelines through the use of shadcn/ui components. These components provide proper ARIA attributes and keyboard navigation support out of the box, making the application usable for all users.

## Future Enhancements

While the current implementation provides a solid foundation, there are several areas where the application could be enhanced:

Smart caching strategies could be implemented to reduce API calls and improve performance. This might involve storing frequently accessed data in local storage or implementing a service worker for offline capabilities.

Real-time data updates could be added using WebSocket connections, allowing the options chain to update automatically as market conditions change. This would require additional integration with Schwab's streaming API services.

Advanced filtering and analysis tools could be added to help users identify specific options contracts based on their trading strategies. This might include Greek calculations, implied volatility analysis, and custom screening criteria.

## Contributing

If you're interested in contributing to this project, please review the code structure and existing patterns before submitting pull requests. The project maintains high standards for code quality, including comprehensive TypeScript coverage and consistent styling through ESLint and Prettier configurations.

Development should follow the existing patterns for component organization, state management, and type safety. All new features should include appropriate error handling and loading states to ensure a smooth user experience.

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3). This means you are free to use, modify, and distribute this software, but any derivative works must also be distributed under the same license terms. This ensures that all modifications and improvements remain free and open source.

Key points of GPLv3:
- You can use the software for any purpose
- You can modify the software and distribute modified versions
- You must provide the source code when you distribute the software
- Any modifications must be released under GPLv3
- No warranties are provided

For the full license text, see the [LICENSE](LICENSE) file in the repository.