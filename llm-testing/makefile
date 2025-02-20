# Makefile for Gemini Testing Environment
# Python variables
PYTHON := python3
VENV := venv
VENV_BIN := $(VENV)/bin
PARENT_ENV := $(shell cd .. && pwd)/.env
SCRIPT_NAME := tuned-llm-testing.py  # Updated script name

# Default target
.DEFAULT_GOAL := help

.PHONY: help build clean run check-env

help:
	@echo "Available commands:"
	@echo "  make build     - Create virtual environment and install dependencies"
	@echo "  make run      - Run the Gemini tester script"
	@echo "  make clean    - Remove virtual environment and cleanup"

check-env:
	@if [ ! -f $(PARENT_ENV) ]; then \
		echo "Error: .env file not found in parent directory"; \
		echo "Expected location: $(PARENT_ENV)"; \
		exit 1; \
	fi

$(VENV)/bin/activate:
	$(PYTHON) -m venv $(VENV)
	$(VENV_BIN)/pip install --upgrade pip

build: $(VENV)/bin/activate
	$(VENV_BIN)/pip install -r requirements.txt

run:
	$(VENV_BIN)/python $(SCRIPT_NAME)

clean:
	rm -rf $(VENV)
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.log" -delete