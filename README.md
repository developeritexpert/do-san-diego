# DO San Diego - Craft CMS Project Setup Guide

This document outlines the standard steps to set up and run this Craft CMS project on a new local development environment or server.

---

## System Requirements

Ensure your server or local environment meets the following requirements:

- **PHP**: 8.2 or higher
- **PHP Extensions**: `ctype`, `curl`, `dom`, `ft2-build` / `gd` or `imagick`, `iconv`, `json`, `mbstring`, `openssl`, `pcre`, `pdo`, `pdo_mysql` (or `pdo_pgsql`), `zip`
- **Database**: MySQL 8.0+, MariaDB 10.5+, or PostgreSQL 12+
- **Composer**: 2.x
- **Web Server**: Apache or Nginx (with URL rewriting enabled to point to the `web/` directory) or PHP built-in server.

---

## Installation Steps

### Step 1: Clone or Extract Project Files

Extract or clone the project directory to your desired location:

```bash
cd /path/to/do-san-diego
```

---

### Step 2: Install PHP Dependencies

Run Composer to install all required Craft CMS core packages and plugins:

```bash
composer install
```

---

### Step 3: Environment Configuration (`.env`)

1. Create a `.env` file in the root directory by copying the sample environment file:
   ```bash
   cp .env.example.dev .env
   ```
2. Open `.env` and configure your database connection and environment settings:

   ```ini
   # Database Configuration
   CRAFT_DB_DRIVER="mysql"
   CRAFT_DB_SERVER="127.0.0.1"
   CRAFT_DB_PORT="3306"
   CRAFT_DB_DATABASE="your_database_name"
   CRAFT_DB_USER="your_database_user"
   CRAFT_DB_PASSWORD="your_database_password"
   CRAFT_DB_SCHEMA="public"
   CRAFT_DB_TABLE_PREFIX=""

   # General Settings
   CRAFT_APP_ID="CraftCMS--your-unique-app-id"
   CRAFT_ENVIRONMENT="dev"
   CRAFT_SECURITY_KEY="your-security-key"
   CRAFT_DEV_MODE=true
   CRAFT_ALLOW_ADMIN_CHANGES=true
   CRAFT_DISALLOW_ROBOTS=true

   # Site URL
   PRIMARY_SITE_URL="http://localhost:8080"
   ```

---

### Step 4: Import Database Dump (If transferring existing content)

If you have an existing database backup (`.sql` dump file):

```bash
mysql -u your_database_user -p your_database_name < path/to/database_dump.sql
```

Alternatively, if setting up from scratch without an existing database backup:

```bash
./craft setup
```

---

### Step 5: Run Craft Upgrades & Apply Project Config

Run Craft's setup migration command to ensure all database migrations, project config changes, and plugins are synchronized:

```bash
./craft up
```

---

### Step 6: Set Directory Permissions

Ensure the following directories have write permissions:

```bash
chmod -R 775 storage
chmod -R 775 web/cpresources
```

---

### Step 7: Serve the Application locally

#### Option A: Using PHP built-in server

```bash
php -S localhost:8080 -t web
```

#### Option B: Using Web Server (Nginx / Apache / Valet)

Point your host document root directly to the **`web/`** directory.

---

## Admin Access

- **Control Panel URL**: `http://localhost:8080/admin`
- Log in using your Craft CMS administrator credentials.

---

## Project Structure Overview

- `config/` - Craft CMS project configuration files & schemas
- `templates/` - Twig templates containing section components & cards
- `web/` - Public document root (`index.php`, CSS, JS, and image assets)
  - `web/assets/css/main.css` - Custom styling
  - `web/assets/js/main.js` - Interactive slider scripts

---

## AI Assistant Prompt (Copy & Paste for ChatGPT / Antigravity)

> **Prompt for AI Assistant:**
> "I am setting up this Craft CMS 5 project on a new system. Please read this README.md file and provide me with exact, step-by-step shell/terminal commands to execute for installing dependencies, setting up database environment variables, applying Craft migrations/project config, setting directory permissions, and launching the local server."
