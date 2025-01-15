#!/bin/bash

#===============================================================================
# configure-domain-specific-instance.bash
#===============================================================================
# Author: mitzvahcapitalist
# Created: Wednesday, January 15, 2024
# Last Modified: Wednesday, January 15, 2024
# Copyright: Mitzvah Capital LLC
# License: GNU General Public License v3.0 (GPLv3)
#===============================================================================
# Overview:
#   This script automates the initial configuration process for instances of the
#   Schwab Options Chain Viewer application after forking from the main repository.
#   It handles creation of configuration templates, domain customization, and
#   git remote setup for upstream updates.
#
# Usage:
#   bash scripts/configure-domain-specific-instance.bash
#
# The script will interactively prompt for:
#   - Company name
#   - Domain name
#   - Subdomain for the service
#
# Actions performed:
#   1. Creates configuration templates from existing files
#   2. Sets up upstream git remote
#   3. Configures domain-specific settings
#   4. Creates initial environment files
#   5. Sets up a new git branch for customization
#
# Requirements:
#   - Git
#   - Bash 4.0 or higher
#   - Read/write access to the repository
#   - Must be run from the project root or scripts directory
#===============================================================================

# Ensure we're in the project root directory
cd "$(dirname "$0")/.." || exit 1

# Exit on any error
set -e

# Function to check if required commands are available
check_requirements() {
    local required_commands=("git" "sed")
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            echo "Error: Required command '$cmd' is not available"
            exit 1
        fi
    done
}

# Function to prompt for input with validation
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    local value=""
    
    while [[ -z "$value" ]]; do
        read -p "$prompt: " value
        if [[ -z "$value" ]]; then
            echo "Error: Input cannot be empty"
        fi
    done
    
    # Use indirect variable reference to store the result
    printf -v "$var_name" "%s" "$value"
}

# Function to verify we're in the project root
verify_project_root() {
    if [[ ! -d "src" ]] || [[ ! -f "package.json" ]]; then
        echo "Error: Script must be run from the project root directory"
        echo "Current directory: $(pwd)"
        exit 1
    fi
}

# Main setup function
main() {
    echo "Beginning configuration of Schwab Options Chain Viewer instance"
    echo "============================================================"
    echo

    # Verify requirements and location
    check_requirements
    verify_project_root

    # Gather configuration information
    prompt_input "Enter your company name (e.g., incremental)" COMPANY_NAME
    prompt_input "Enter your domain (e.g., incremental.capital)" DOMAIN_NAME
    prompt_input "Enter your subdomain for the service (e.g., schwab)" SUBDOMAIN

    echo
    echo "Creating configuration templates..."
    
    # Create auth config template
    if [[ -f "src/config/auth.ts" ]]; then
        sed "s/schwab\.mitzvah\.capital/${SUBDOMAIN}.${DOMAIN_NAME}/g" \
            src/config/auth.ts > src/config/auth.template.ts
        echo "Created src/config/auth.template.ts"
    else
        echo "Error: src/config/auth.ts not found"
        exit 1
    fi

    # Create environment template
    cat > .env.template << EOF
VITE_SCHWAB_CLIENT_ID=your_client_id_here
VITE_SCHWAB_CLIENT_SECRET=your_client_secret_here
EOF
    echo "Created .env.template"

    # Create initial .env file
    cp .env.template .env
    echo "Created initial .env file"

    # Set up git remote
    echo
    echo "Setting up git remote for upstream updates..."
    if ! git remote | grep -q "^upstream$"; then
        git remote add upstream https://github.com/mitzvahengineering/scwhab-api-client.git
        echo "Added upstream remote"
    else
        echo "Upstream remote already exists"
    fi

    # Create new branch for customization
    local branch_name="setup/${COMPANY_NAME}"
    echo
    echo "Creating new branch for customization..."
    git checkout -b "$branch_name" 2>/dev/null || echo "Branch $branch_name already exists"

    # Display completion message and next steps
    echo
    echo "Configuration completed successfully"
    echo "============================================================"
    echo
    echo "Next steps:"
    echo "1. Add your Schwab API credentials to .env:"
    echo "   VITE_SCHWAB_CLIENT_ID=your_client_id_here"
    echo "   VITE_SCHWAB_CLIENT_SECRET=your_client_secret_here"
    echo
    echo "2. Install dependencies if you haven't already:"
    echo "   npm install"
    echo
    echo "3. Start the development server:"
    echo "   npm run dev"
    echo
    echo "4. Update your callback URL in the Schwab developer portal to:"
    echo "   https://${SUBDOMAIN}.${DOMAIN_NAME}/callback"
    echo
    echo "5. Verify your configuration by visiting:"
    echo "   https://${SUBDOMAIN}.${DOMAIN_NAME}"
    echo
}

# Execute main function
main