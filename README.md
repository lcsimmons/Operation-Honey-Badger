# Operation-Honey-Badger
 
## Installation Instructions

Project Honey Badger is a sophisticated honeypot system designed to attract, monitor, and analyze potential cyber threats. Before beginning installation, ensure your system meets the following requirements: Python 3, Node.js and npm, Make utility, and optionally Docker for database initialization. A minimum of 10GB storage space and internet connection for API functionality are also recommended.

The installation process utilizes a comprehensive script that automates most of the setup. Begin by cloning the repository to your local machine and navigating to the root directory. Open a terminal window, navigate to the repository's root directory, and run:


chmod +x install.sh
./install.sh

During installation, the script checks for required software components including Python, Node.js, npm, and make. If any components are missing, the script will notify you and exit. You'll need to install these prerequisites before attempting installation again.

The script also verifies the existence and completeness of environment files across all components. These files contain critical configuration variables such as API keys, database credentials, and connection URLs. If any required environment files are missing or incomplete, the script will provide specific guidance on which files need attention and what variables need to be added.

After verification, the script builds all backend components (backend-flask, flask-honeypot, and llm-testing) and installs dependencies for frontend components (frontend and frontend-admin). The terminal will display real-time progress with color-coded success and error messages to help troubleshoot any issues that arise.

Finally, the script offers the option to initialize a PostgreSQL database in a Docker container. This step is optional but recommended for a complete setup. If you choose to initialize the database, ensure Docker is installed and running on your system.

Deployment Note: The installation process described above is intended for local testing and development environments. For production deployment, the system can be hosted on cloud services such as AWS, Azure, or Google Cloud Platform. When deploying to production environments, ensure all URLs in the .env files are updated to reflect your production endpoints. Additionally, components should be configured to run as system services with appropriate startup scripts rather than using development commands like ``make run'' or ``npm run dev''. Consider using containerization solutions like Docker Compose or Kubernetes for orchestrating the various components in production.
