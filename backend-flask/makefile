# Makefile for Flask backend with virtual environment

# Variables
VENV_NAME := venv
PYTHON := python3
PIP := $(VENV_NAME)/bin/pip
PYTHON_VENV := $(VENV_NAME)/bin/python
FLASK := $(VENV_NAME)/bin/flask
APP_FILE := app.py

# Determine the correct activation path based on OS
ifeq ($(OS),Windows_NT)
	VENV_ACTIVATE := $(VENV_NAME)/Scripts/activate
else
	VENV_ACTIVATE := $(VENV_NAME)/bin/activate
endif

.PHONY: help build clean run test

help:
	@echo "Available commands:"
	@echo "  make build    - Create virtual environment and install dependencies"
	@echo "  make run      - Run the Flask application"
	@echo "  make clean    - Remove virtual environment and cached files"
	@echo "  make test     - Run tests"

# Create virtual environment and install dependencies
build: $(VENV_NAME)/bin/activate

$(VENV_NAME)/bin/activate:
	@echo "Creating virtual environment..."
	$(PYTHON) -m venv $(VENV_NAME)
	@echo "Installing dependencies..."
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	@echo "Virtual environment setup complete."

# Run the Flask application (without rebuilding)
run:
	@if [ ! -d "$(VENV_NAME)" ]; then \
		echo "Virtual environment not found. Run 'make build' first."; \
		exit 1; \
	fi
	@echo "Starting Flask application..."
	$(PYTHON_VENV) $(APP_FILE)

# Clean up the environment
clean:
	@echo "Cleaning up..."
	rm -rf $(VENV_NAME)
	rm -rf __pycache__
	rm -rf *.pyc
	@echo "Cleanup complete."

# Run tests
test:
	@if [ ! -d "$(VENV_NAME)" ]; then \
		echo "Virtual environment not found. Run 'make build' first."; \
		exit 1; \
	fi
	@echo "Running tests..."
	$(PYTHON_VENV) -m pytest -v