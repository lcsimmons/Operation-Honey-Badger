#!/bin/bash

# OPERATION-HONEY-BADGER Installation Script
# This script sets up all components of the Operation Honey Badger project

# Text formatting
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${BOLD}${BLUE}=== $1 ===${NC}\n"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ ERROR: $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}⚠ WARNING: $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if Python3 exists for creating virtual environments
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python is installed: $PYTHON_VERSION"
    else
        print_error "Python 3 is not installed. It's required for virtual environments."
        exit 1
    fi
    
    # Check for Node.js and npm
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js and try again."
        exit 1
    fi
    
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check for make
    if command_exists make; then
        print_success "make is installed"
    else
        print_error "make is not installed. Please install make and try again."
        exit 1
    fi
}

# Function to check and validate environment files
check_env_files() {
    print_header "Checking Environment Files"
    
    # Check backend-flask .env
    if [ -f "backend-flask/.env" ]; then
        # Validate required variables
        BACKEND_FLASK_ENV_VARS=("DB_USERNAME" "DB_PASSWORD" "DB_NAME" "IP_INFO_ACCESS_TOKEN" "GEMINI_API_KEY")
        MISSING_VARS=()
        
        for VAR in "${BACKEND_FLASK_ENV_VARS[@]}"; do
            if ! grep -q "^$VAR=" "backend-flask/.env"; then
                MISSING_VARS+=("$VAR")
            fi
        done
        
        if [ ${#MISSING_VARS[@]} -eq 0 ]; then
            print_success "backend-flask/.env exists with all required variables"
        else
            print_error "backend-flask/.env is missing these variables: ${MISSING_VARS[*]}"
            print_warning "Please add the missing variables to backend-flask/.env (check .env.example for format)"
            exit 1
        fi
    else
        print_error "backend-flask/.env does not exist"
        print_warning "Please create backend-flask/.env based on the .env.example file"
        exit 1
    fi
    
    # Check flask-honeypot .env.local
    if [ -f "flask-honeypot/.env.local" ]; then
        # Validate required variables
        if grep -q "^BACKEND_API_URL=" "flask-honeypot/.env.local"; then
            print_success "flask-honeypot/.env.local exists with required variable"
        else
            print_error "flask-honeypot/.env.local is missing BACKEND_API_URL"
            print_warning "Please add BACKEND_API_URL to flask-honeypot/.env.local (check .env.example for format)"
            exit 1
        fi
    else
        print_error "flask-honeypot/.env.local does not exist"
        print_warning "Please create flask-honeypot/.env.local based on the .env.example file"
        exit 1
    fi
    
    # Check frontend .env.example
    if [ -f "frontend/.env.example" ]; then
        # Validate required variables
        if grep -q "^NEXT_PUBLIC_API_HOST=" "frontend/.env.example"; then
            print_success "frontend/.env.example exists with required variable"
        else
            print_error "frontend/.env.example is missing NEXT_PUBLIC_API_HOST"
            print_warning "Please add NEXT_PUBLIC_API_HOST to frontend/.env.example"
            exit 1
        fi
    else
        print_error "frontend/.env.example does not exist"
        print_warning "Please check that the frontend directory contains the expected .env.example file"
        exit 1
    fi
    
    # Check frontend-admin .env.local
    if [ -f "frontend-admin/.env.local" ]; then
        # Validate required variables
        FRONTEND_ADMIN_ENV_VARS=("GOOGLE_CLOUD_PROJECT_ID" "GOOGLE_TRANSLATE_API_KEY" "NEXT_PUBLIC_API_URL")
        MISSING_VARS=()
        
        for VAR in "${FRONTEND_ADMIN_ENV_VARS[@]}"; do
            if ! grep -q "^$VAR=" "frontend-admin/.env.local"; then
                MISSING_VARS+=("$VAR")
            fi
        done
        
        if [ ${#MISSING_VARS[@]} -eq 0 ]; then
            print_success "frontend-admin/.env.local exists with all required variables"
        else
            print_error "frontend-admin/.env.local is missing these variables: ${MISSING_VARS[*]}"
            print_warning "Please add the missing variables to frontend-admin/.env.local (check .env.example for format)"
            exit 1
        fi
    else
        print_error "frontend-admin/.env.local does not exist"
        print_warning "Please create frontend-admin/.env.local based on the .env.example file"
        exit 1
    fi
    
    # Check llm-testing .env
    if [ -f "llm-testing/.env" ]; then
        # Validate required variables
        if grep -q "^GEMINI_API_KEY=" "llm-testing/.env"; then
            print_success "llm-testing/.env exists with required variable"
        else
            print_error "llm-testing/.env is missing GEMINI_API_KEY"
            print_warning "Please add GEMINI_API_KEY to llm-testing/.env (check .env.example for format)"
            exit 1
        fi
    else
        print_error "llm-testing/.env does not exist"
        print_warning "Please create llm-testing/.env based on the .env.example file"
        exit 1
    fi
}

# Function to build backend components
build_backend_components() {
    print_header "Building Backend Components"
    
    # Build backend-flask
    print_header "Building backend-flask"
    cd backend-flask || exit 1
    make clean
    make build
    if [ $? -eq 0 ]; then
        print_success "backend-flask built successfully"
    else
        print_error "Failed to build backend-flask"
        exit 1
    fi
    cd ..
    
    # Build flask-honeypot
    print_header "Building flask-honeypot"
    cd flask-honeypot || exit 1
    make clean
    make build
    if [ $? -eq 0 ]; then
        print_success "flask-honeypot built successfully"
    else
        print_error "Failed to build flask-honeypot"
        exit 1
    fi
    cd ..
    
    # Build llm-testing
    print_header "Building llm-testing"
    cd llm-testing || exit 1
    make clean
    make build
    if [ $? -eq 0 ]; then
        print_success "llm-testing built successfully"
    else
        print_error "Failed to build llm-testing"
        exit 1
    fi
    cd ..
}

# Function to build frontend components
build_frontend_components() {
    print_header "Building Frontend Components"
    
    # Build frontend
    print_header "Building frontend"
    cd frontend || exit 1
    npm install
    if [ $? -eq 0 ]; then
        print_success "frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
    
    # Build frontend-admin
    print_header "Building frontend-admin"
    cd frontend-admin || exit 1
    npm install
    if [ $? -eq 0 ]; then
        print_success "frontend-admin dependencies installed successfully"
    else
        print_error "Failed to install frontend-admin dependencies"
        exit 1
    fi
    cd ..
}

# Function to initialize the database (only if explicitly requested)
init_database() {
    print_header "Database Setup"
    
    # Ask if the user wants to initialize the database
    read -p "Do you want to initialize the PostgreSQL database? This will create a new Docker container (y/n): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Skipping database initialization"
        return
    fi
    
    # Check if Docker is available only if user selected yes to database initialization
    if ! command_exists docker; then
        print_error "Docker is not installed. Cannot initialize database."
        print_warning "Please install Docker if you need database functionality."
        return
    fi
    
    # Confirm if they understand this will reset any existing data
    read -p "WARNING: This will stop and remove any existing honeybadger_db container. Continue? (y/n): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Database initialization cancelled"
        return
    fi
    
    cd backend-flask || exit 1
    
    # Check if db_init.sh exists and is executable
    if [ -f "db_init.sh" ]; then
        chmod +x db_init.sh
        ./db_init.sh
        if [ $? -eq 0 ]; then
            print_success "Database initialized successfully"
        else
            print_error "Failed to initialize database"
        fi
    else
        print_error "db_init.sh not found in backend-flask directory"
    fi
    
    cd ..
}

# Main function to run the installation
main() {
    echo -e "${BOLD}${BLUE}"
    echo "  ___                       _   _                _   _                          ___          _                "
    echo " / _ \ _ __   ___ _ __ __ _| |_(_) ___  _ __    | | | | ___  _ __   ___ _   _ | _ ) __ _ __| | __ _  ___ _ _ "
    echo "| | | | '_ \ / _ \ '__/ _\` | __| |/ _ \| '_ \   | |_| |/ _ \| '_ \ / _ \ | | || _ \/ _\` / _\` |/ _\` |/ _ \ '_|"
    echo "| |_| | |_) |  __/ | | (_| | |_| | (_) | | | |  |  _  | (_) | | | |  __/ |_| || |_| (_| \__,_| (_| |  __/ |  "
    echo " \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|  |_| |_|\___/|_| |_|\___|\__, ||___/\__,_\__,_|\__, |\___|_|  "
    echo "      |_|                                                                |___/                 |___/          "
    echo -e "${NC}"
    echo -e "${BOLD}Installation Script${NC}"
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Check environment files
    check_env_files
    
    # Build backend components
    build_backend_components
    
    # Build frontend components
    build_frontend_components
    
    # Initialize database
    init_database
    
    print_header "Installation Complete"
    echo -e "${GREEN}Operation Honey Badger has been successfully installed!${NC}"
    echo
    echo "To run the components:"
    echo "1. Backend Flask: cd backend-flask && make run"
    echo "2. Honeypot Flask (port 6969 functionality): cd flask-honeypot && make run"
    echo "3. Honeypot Frontend: cd frontend && npm run dev"
    echo "4. SOC Admin Frontend: cd frontend-admin && npm run dev"
    echo "5. LLM Testing: cd llm-testing && make run"
    echo
    echo -e "${YELLOW}Note: Make sure the database is running before starting the backend services${NC}"
}

# Run the main function
main