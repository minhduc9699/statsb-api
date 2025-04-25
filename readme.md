# Node.js RESTful API Starter Template

A clean, production-ready Node.js starter template for building RESTful APIs using Express, MongoDB, and Mongoose.

This template provides a solid foundation for your Node.js projects with many built-in features, such as authentication using JWT, request validation, Docker support, API documentation, and more.

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [JWT](https://jwt.io) (access and refresh tokens)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [npm](https://www.npmjs.com/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**: Docker and Docker Compose support
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)

## Getting Started

### Installation

1. Clone the repo:
```bash
git clone https://github.com/your-username/nodejs-starter-template.git
cd nodejs-starter-template
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables:
```bash
cp .env.example .env
# open .env and modify the environment variables
```

### Commands

Running locally:
```bash
npm run dev
```

Running in production:
```bash
npm start
```

Testing:
```bash
# run all tests
npm test

# run test coverage
npm run coverage
```

Docker:
```bash
# run docker container in development mode
npm run docker:dev

# run docker container in production mode
npm run docker:prod

# run all tests in a docker container
npm run docker:test
```

Linting:
```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```

## Project Structure

```
.
├── src/
│   ├── config/             # Environment variables and configuration
│   ├── db/                 # Database connection and configuration
│   ├── docs/               # Swagger documentation
│   ├── helpers/            # Helper functions
│   ├── middlewares/        # Custom express middlewares
│   ├── modules/            # Business logic organized in modules
│   │   └── users/          # User module (authentication, etc.)
│   ├── routes/             # Routes
│   │   └── v1/             # API version 1 routes
│   ├── utils/              # Utility functions
│   ├── app.js              # Express app
│   └── index.js            # App entry point
├── test/                   # Tests
├── .env                    # Environment variables
├── .env.example            # Environment variables example
├── .eslintrc.json          # ESLint config
├── .prettierrc.json        # Prettier config
├── docker-compose.yml      # Docker compose configuration
├── Dockerfile              # Docker configuration
├── jest.config.js          # Jest configuration
├── package.json            # Package info
└── README.md               # Project documentation
```

## API Documentation

To view the API documentation, run the server and go to `http://localhost:3000/v1/docs` in your browser.

## Authentication

This template uses JWT-based authentication. The JWT authentication works as follows:

- User registers with email/password
- User logs in with email/password and receives access token and refresh token
- Access token is used to authenticate API requests
- Refresh token is used to get a new access token when the current one expires

## License

[MIT](LICENSE)
