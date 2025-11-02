# Jira Scraper & LLM Corpus Creator

## 1. Overview

This project is a sophisticated web application designed to simulate the process of scraping data from public Apache Jira projects. It transforms the collected data into a structured JSONL (JSON Lines) format, creating a corpus suitable for training and fine-tuning Large Language Models (LLMs).

The application provides an interactive and intuitive interface for users to select specific Jira projects, monitor the scraping process in real-time, and finally, leverage the power of the Google Gemini API to perform an initial analysis of the generated corpus.

### Key Features

*   **Interactive Project Selection**: A clean UI to select one or more Apache Jira projects (e.g., Spark, Kafka, Hadoop) for data scraping.
*   **Realistic Scraping Simulation**: A robust simulation that mimics the process of fetching issues and comments, complete with real-time progress bars, status messages, and statistics.
*   **JSONL Corpus Generation**: Transforms raw Jira data into the JSONL format, where each line is a valid JSON object representing a single Jira issue. This format is highly efficient for LLM training pipelines.
*   **AI-Powered Analysis**: Integrates with the Google Gemini API to provide a high-level analysis of the generated corpus, identifying common themes and patterns within the data.
*   **Responsive & Modern UI**: Built with React and Tailwind CSS for a clean, responsive, and user-friendly experience.

---

## 2. Getting Started & Setup

This application is designed to run entirely in the browser within a managed execution environment (such as Google's AI Studio). No local installation or complex setup is required.

### Environment Configuration

*   **API Key**: The application requires a Google Gemini API key to perform data analysis. The key is expected to be available in the execution environment as `process.env.API_KEY`. The application is pre-configured to use this variable, so **no manual key insertion is necessary**.
*   **Dependencies**: All necessary dependencies (like `react` and `@google/genai`) are loaded via an `importmap` in `index.html` from a CDN, eliminating the need for a package manager like `npm` or `yarn`.

### Running the Application

Simply open the `index.html` file in a web browser that supports modern JavaScript (ES modules). The application will load and be ready for use immediately.

---

## 3. Architecture and Design Reasoning

The application follows a frontend-only architecture for simplicity, portability, and to avoid the need for backend infrastructure.

### Core Technologies

*   **React (v19)**: The core of the user interface, utilizing hooks (`useState`, `useCallback`, `useRef`) for efficient state management and component logic.
*   **TypeScript**: Ensures type safety, making the codebase more robust, readable, and less prone to runtime errors.
*   **Tailwind CSS**: A utility-first CSS framework used for rapid and consistent styling of the UI components.
*   **@google/genai SDK**: The official JavaScript SDK for interacting with the Gemini API, providing a simple and powerful interface for generative AI tasks.

### Component Structure

The application is broken down into logical, reusable components:

*   `App.tsx`: The root component that acts as the central orchestrator. It manages the application's global state (selected projects, scraping progress, results) and handles the core logic of passing data and callbacks between child components.
*   `components/ProjectSelector.tsx`: A UI for displaying the available Jira projects and managing user selections. It is disabled during the scraping process to prevent state inconsistencies.
*   `components/ControlPanel.tsx`: Contains the "Start" and "Stop" buttons, controlling the lifecycle of the scraping simulation.
*   `components/ProgressMonitor.tsx`: Provides real-time visual feedback on the scraping process, including a progress bar, status messages, and key statistics. It also displays any errors that occur.
*   `components/ResultsViewer.tsx`: Displays the final generated JSONL corpus and the analysis from the Gemini API. It includes functionality to copy the corpus to the clipboard.

### Service Layer

Business logic is abstracted into a `services` directory to separate concerns from the UI:

*   `services/jiraScraper.ts`: This is the heart of the data collection simulation. See the "Edge Cases Handled" section for a detailed explanation of why this is a simulation. It uses `setTimeout` to mimic network latency and provides progress updates via callbacks (`onProgress`, `onComplete`, `onError`).
*   `services/geminiService.ts`: A dedicated module that encapsulates all interaction with the Gemini API. It constructs the prompt, makes the API call, and handles potential errors gracefully.
*   `services/sample-data.ts`: Contains a static, pre-fetched sample of real public data from the Apache Jira API. This is a crucial part of the design to ensure the application functions reliably.

---

## 4. Edge Cases and Error Handling

Several important edge cases and potential points of failure have been addressed in the application's design.

*   **CORS (Cross-Origin Resource Sharing) Policy**: The most significant technical constraint is the browser's same-origin policy. Direct API calls from the web app's domain to `issues.apache.org` are blocked by the browser for security reasons.
    *   **Solution**: Instead of making live, failing API calls, the application uses a pre-fetched, representative dataset stored in `services/sample-data.ts`. This ensures the application is **always functional** and provides a high-quality demonstration using real data, while artfully sidestepping the CORS limitation. The scraping process is then realistically *simulated* over this local data.

*   **Graceful Stoppage**: A user can stop the scraping process at any time.
    *   **Solution**: The `runScrapingSimulation` function returns a `stop` method. This method sets a boolean flag (`isScrapingStopped`) that is checked before each asynchronous operation (simulated network call). This ensures the simulation terminates cleanly without processing further data. All pending `setTimeout` calls are also cleared to prevent memory leaks.

*   **Gemini API Failures**: Network issues or an invalid API key could cause the analysis step to fail.
    *   **Solution**: The `analyzeDataWithGemini` function is wrapped in a `try...catch` block. If an error occurs, it is caught, logged to the console, and a user-friendly error message is displayed in the UI via the `onError` callback in `App.tsx`.

*   **User Input Validation**: Starting the process without selecting any projects would be pointless.
    *   **Solution**: The "Start Scraping" button is disabled until at least one project is selected. An error message is also displayed if the user could somehow trigger the start action.

---

## 5. Optimizations and Future Improvements

The application is built with performance and extensibility in mind.

### Optimization Decisions

*   **Local Data Simulation**: The primary optimization is the use of local sample data. This is orders of magnitude faster and more reliable than making hundreds of live HTTP requests, which would be subject to network latency and rate limiting.
*   **Memoization**: React's `useCallback` hook is used for event handler functions (`handleStartScraping`, etc.) passed down to child components. This prevents unnecessary re-renders of those components, ensuring a smooth UI even during rapid state updates.
*   **Efficient Data Format**: JSONL is chosen specifically because it is a stream-friendly format. Each line can be read and parsed independently, which is highly efficient for downstream data loading and processing in machine learning pipelines.

### Potential Future Improvements

*   **Backend Proxy for Live Data**: To enable true live scraping, a simple backend server (e.g., in Node.js with Express) could be developed. This server would act as a proxy: the frontend would make requests to the backend, which would then make requests to the Jira API. Since server-to-server requests are not subject to CORS, this would solve the core limitation.
*   **Database Integration**: The backend could be extended to store scraped results in a database (e.g., SQLite, PostgreSQL). This would allow for data persistence, historical analysis, and scraping much larger datasets that wouldn't fit in browser memory.
*   **Advanced Gemini Tasks**: The interaction with Gemini could be made more sophisticated. Instead of a single analysis, the app could be configured to generate specific derived tasks for each issue, such as:
    *   Generating multiple Question/Answer pairs.
    *   Classifying the issue type based on its text (e.g., "Bug Report", "Feature Request", "Documentation").
    *   Performing sentiment analysis on comments.
*   **User-Configurable Scraping**: Add UI controls to allow the user to specify a date range for issues or set the maximum number of issues to scrape per project, which would involve implementing logic to handle Jira API pagination.
*   **Export Options**: Add buttons to download the generated corpus as a `.jsonl` file or the Gemini analysis as a `.txt` file.
