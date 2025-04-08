# Honeypot Flask App Makefile

# Configuration variables
VENV_NAME = venv
PYTHON = python3
PIP = $(VENV_NAME)/bin/pip
PYTHON_VENV = $(VENV_NAME)/bin/python
FLASK = $(VENV_NAME)/bin/flask
GUNICORN = $(VENV_NAME)/bin/gunicorn
APP_FILE = app.py
WSGI_FILE = wsgi.py
PORT = 6969
INTERNAL_PORT = 8969
WORKERS = 3

.PHONY: build clean run run-gunicorn help requirements.txt test

# Default target
help:
	@echo "Available commands:"
	@echo "  make build          - Create virtual environment and install dependencies"
	@echo "  make clean          - Remove virtual environment and cached files"
	@echo "  make run            - Run the Flask application on port $(INTERNAL_PORT) (development)"
	@echo "  make run-gunicorn   - Run the Flask application with Gunicorn (production)"
	@echo "  make test           - Run tests (if available)"

# Create virtual environment and install dependencies
build: $(VENV_NAME)/bin/activate

$(VENV_NAME)/bin/activate: requirements.txt
	test -d $(VENV_NAME) || $(PYTHON) -m venv $(VENV_NAME)
	. $(VENV_NAME)/bin/activate && pip install --upgrade pip
	. $(VENV_NAME)/bin/activate && pip install -r requirements.txt
	. $(VENV_NAME)/bin/activate && pip install gunicorn
	touch $(VENV_NAME)/bin/activate

# Generate requirements file if it doesn't exist
requirements.txt:
	@echo "Creating sample requirements.txt file"
	@echo "flask==2.3.3" > requirements.txt
	@echo "requests==2.31.0" >> requirements.txt
	@echo "python-dotenv==1.0.0" >> requirements.txt
	@echo "ipinfo==4.4.3" >> requirements.txt
	@echo "user-agents==2.2.0" >> requirements.txt
	@echo "requirements.txt created. Please update with your specific package versions as needed."

# Run the Flask application (development server)
run: build
	@echo "Starting Flask app on port $(INTERNAL_PORT)..."
	$(PYTHON_VENV) $(APP_FILE)

# Run with Gunicorn (production server)
run-gunicorn: build $(WSGI_FILE)
	@echo "Starting Flask app with Gunicorn on port $(INTERNAL_PORT) with $(WORKERS) workers..."
	$(GUNICORN) --workers $(WORKERS) --bind 127.0.0.1:$(INTERNAL_PORT) wsgi:app

# Create WSGI file if it doesn't exist
$(WSGI_FILE):
	@echo "Creating WSGI file..."
	@echo "from app import app" > $(WSGI_FILE)
	@echo "" >> $(WSGI_FILE)
	@echo "if __name__ == \"__main__\":" >> $(WSGI_FILE)
	@echo "    app.run()" >> $(WSGI_FILE)

# Run tests if they exist
test: build
	@if [ -d "tests" ]; then \
		$(PYTHON_VENV) -m pytest tests; \
	else \
		echo "No tests directory found"; \
	fi

# Clean up virtual environment and cache files
clean:
	@echo "Cleaning up..."
	rm -rf $(VENV_NAME)
	rm -rf __pycache__
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf .eggs
	find . -name "*.pyc" -type f -delete
	find . -name "*.pyo" -type f -delete
	find . -name "__pycache__" -type d -delete
	@echo "Cleanup complete"