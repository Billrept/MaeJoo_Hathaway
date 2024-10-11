# MaeJoo_Hathaway

This project is developed for the GUI chapter of the Advanced Computer Programming and Introduction to Algorithms class under the Department of Robotics and AI Engineering, School of Engineering, KMITL.

## Overview
MaeJoo_Hathaway is a project primarily written in JavaScript and Python. It aims to integrate advanced data analysis algorithms, such as ARIMA and GARCH models, for monitoring and managing financial or stock data. By leveraging these models, the platform provides insights into historical trends and volatility of stock prices without predicting future values. It features interactive tools like graphs and dashboards, enabling users to visualize stock performance and make informed decisions based on past market behavior..

## Getting Started

### Prerequisites
- Ensure you have Node.js and Python 3.9 installed.

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Billrept/MaeJoo_Hathaway.git
    cd MaeJoo_Hathaway
    ```
2. Install the dependencies:
    ```bash
    npm install
    pip install -r requirements.txt
    ```
    
### Building the Production Image
To build a production-ready Docker image, run:
```bash
docker-compose build
```

### Running the Application
- The application will be available at `http://localhost:3000`.
- It uses hot-reloading for development, so any changes in your source code will automatically reflect on the application.
```bash
docker-compose up
```

## Project Structure
```plaintext
.
├── docker-compose.yaml    # Docker Compose configuration
├── nextjs/
│   ├── components/        # React components for the project
│   ├── pages/             # Next.js pages
│   ├── public/            # Static assets
│   ├── Dockerfile         # Dockerfile for building the Next.js app
│   ├── jsconfig.json      # JS configuration for path aliases
│   ├── next.config.mjs    # Next.js configuration file
│   ├── package.json       # Project dependencies and scripts
│   └── .gitignore         # Ignored files for Git
```

### The `pages` Folder
In a Next.js project, the `pages` folder is central to defining the routes for your application. Each file inside the `pages` directory corresponds to a route based on its file name:
- **`index.js`**: The main landing page of your application, accessible at the root URL (`/`).
- **Dynamic Routing**: You can also create dynamic routes using square brackets. For example, `pages/[id].js` would map to routes like `/123`, `/about`, etc.

## API Proxy Configuration
The project is configured with an API proxy to handle backend requests seamlessly. All routes that begin with /api will be redirected to the backend server running on http://backend:8000. This ensures that API calls are proxied to the backend service without the need to modify frontend code.

This proxy configuration can be modified or updated inside the next.config.mjs file.

## Key Technologies
- **Next.js Framework**: Utilizes Next.js for server-side rendering and static generation.
- **Dockerized**: Easy to build and deploy using Docker, ensuring consistency across environments.
- **MUI (Material UI)**: For building a responsive and elegant UI.
- **State Management**: Uses `zustand` for state management.

## Implementing with Material UI
This project uses [Material UI (MUI)](https://mui.com/material-ui/getting-started/overview/) to enhance the user interface design and development. MUI is a popular React component library that provides pre-built, customizable UI components based on Google's Material Design guidelines.

## Contributing
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.
