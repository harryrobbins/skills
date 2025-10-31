# Decoy API Reference

This document provides comprehensive reference documentation for the Decoy synthetic data generation library.

## Overview

Decoy is a Python-based synthetic data generation tool built on DuckDB that enables repeatable generation of fake data for testing purposes. It exposes data generation functions from Faker, Mimesis, and custom utilities through SQL syntax.

**Key Principle:** Decoy generates data randomly without requiring access to real data and does not learn from real data patterns.

## Installation & Setup

### Prerequisites
- Python 3.10 or higher
- pip package manager

### Installation

```bash
pip install --editable .
```

Or with virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## CLI Commands

### Execute SQL Scripts
```bash
decoy exec path/to/script.sql
```
Executes SQL scripts containing Decoy functions to generate synthetic data.

### Interactive REPL
```bash
decoy repl
```
Launches an interactive SQL shell for experimenting with Decoy functions.

### Jupyter Kernel Installation
```bash
decoy kernel-install
jupyter lab
```
Installs a Jupyter kernel for notebook-based development with Decoy.

## SQL Functions Reference

### Faker Functions

Faker functions generate realistic fake data using the Faker Python library. All faker functions follow the naming pattern `faker_<function_name>()`.

**Common Faker Functions:**
- `faker_name()` - Generates full person names (e.g., "John Smith")
- `faker_first_name()` - Generates first names
- `faker_last_name()` - Generates last names
- `faker_address()` - Generates complete addresses
- `faker_email()` - Generates email addresses
- `faker_phone_number()` - Generates phone numbers
- `faker_company()` - Generates company names
- `faker_catch_phrase()` - Generates marketing catch phrases
- `faker_job()` - Generates job titles
- `faker_date()` - Generates dates
- `faker_day_of_month()` - Generates day values (01-31)
- `faker_passport_number()` - Generates passport identifiers
- `faker_credit_card_number()` - Generates credit card numbers
- `faker_ipv4()` - Generates IPv4 addresses
- `faker_user_name()` - Generates usernames

**Usage Example:**
```sql
SELECT
    faker_name() as name,
    faker_email() as email,
    faker_address() as address
FROM range(100);
```

### Mimesis Functions

Mimesis functions generate localized fake data using the Mimesis Python library. Functions follow the pattern `mimesis_<category>_<function_name>()`.

**Common Mimesis Functions:**
- `mimesis_person_full_name()` - Generates full person names with localization support
- `mimesis_person_email()` - Generates email addresses
- `mimesis_person_phone_number()` - Generates phone numbers with locale-specific formatting
- `mimesis_address_city()` - Generates city names
- `mimesis_address_country()` - Generates country names
- `mimesis_datetime_date()` - Generates dates

**Usage Example:**
```sql
SELECT
    mimesis_person_full_name() as name,
    mimesis_person_email() as email
FROM range(50);
```

### Pattern-Based Generation

#### xeger() - Regex Pattern Generator

The `xeger()` function generates random strings that match a given regular expression pattern.

**Syntax:**
```sql
xeger('regex_pattern')
```

**Examples:**
```sql
-- Generate formatted IDs
SELECT xeger('[0-9]{4}-[A-Z]{4,6}-[1-9]+') as id FROM range(10);
-- Output: "1234-ABCDE-5", "9876-WXYZ-123", etc.

-- Generate phone numbers
SELECT xeger('\(\+0[0-9]{2}\) 07[0-9]{3} [0-9]{6}') as phone FROM range(10);
-- Output: "(+044) 07123 456789", etc.

-- Generate custom codes
SELECT xeger('[A-Z]{3}-[0-9]{6}') as code FROM range(20);
-- Output: "ABC-123456", "XYZ-789012", etc.
```

### Data Manipulation Functions

#### oversample() - Distribute References

The `oversample()` function randomly selects values from a table column, enabling creation of foreign key relationships with uneven distribution.

**Syntax:**
```sql
oversample('table_name', 'column_name')
```

**Usage Pattern:**
```sql
-- Create a reference table
CREATE TABLE companies AS (
    SELECT
        range as id,
        faker_company() as company_name
    FROM range(10)
);

-- Create a larger table with foreign keys to companies
CREATE TABLE employees AS (
    SELECT
        range as id,
        faker_name() as name,
        oversample('companies', 'id') as company_id
    FROM range(100)
);
```

This creates 100 employees distributed across 10 companies with random assignments.

### Messy Data Functions

These functions introduce realistic data quality issues for testing data validation and cleaning logic.

#### messy_data_nullifier()

Introduces NULL values into existing data.

**Syntax:**
```sql
messy_data_nullifier(column_value)
```

**Usage Example:**
```sql
CREATE TABLE names AS (
    SELECT range as id, faker_name() as full_name FROM range(100)
);

-- Introduce NULL values
UPDATE names SET full_name = messy_data_nullifier(full_name);
```

#### messy_data_junk()

Introduces junk/invalid data values.

**Usage Example:**
```sql
UPDATE table_name SET column_name = messy_data_junk(column_name);
```

### Utility Functions

#### range()

Generates a sequence of integers, commonly used to define the number of rows to generate.

**Syntax:**
```sql
range(n)  -- Generates integers from 0 to n-1
```

**Usage:**
```sql
-- Generate 1000 rows
SELECT range as id, faker_name() as name FROM range(1000);
```

## Data Export

Decoy leverages DuckDB's native export capabilities to save generated data in various formats.

### Export to CSV

```sql
COPY (SELECT faker_name(), faker_email() FROM range(100))
TO 'output.csv' WITH (HEADER 1, DELIMITER ',');
```

### Export to Parquet

```sql
COPY (SELECT faker_name(), faker_email() FROM range(100))
TO 'output.parquet' (FORMAT PARQUET);
```

### Export to JSON

```sql
COPY (SELECT faker_name() as name, faker_email() as email FROM range(100))
TO 'output.json';
```

## Common Patterns

### Creating Relational Tables

```sql
-- Parent table
CREATE TABLE departments AS (
    SELECT
        range as dept_id,
        faker_company() as dept_name
    FROM range(5)
);

-- Child table with foreign keys
CREATE TABLE employees AS (
    SELECT
        range as emp_id,
        faker_name() as emp_name,
        faker_email() as emp_email,
        oversample('departments', 'dept_id') as dept_id
    FROM range(50)
);

-- Join tables
SELECT *
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id;
```

### Mixing Multiple Data Sources

```sql
CREATE TABLE users AS (
    SELECT
        range as id,
        faker_name() as name,                    -- From Faker
        mimesis_person_email() as email,         -- From Mimesis
        xeger('[A-Z]{2}[0-9]{6}') as user_code  -- From xeger
    FROM range(100)
);
```

### Creating Realistic Test Data with Constraints

```sql
CREATE TABLE orders AS (
    SELECT
        range as order_id,
        oversample('users', 'id') as user_id,
        faker_date() as order_date,
        CAST(random() * 1000 as INTEGER) as amount
    FROM range(500)
);
```

## Schema Parsing

Decoy can parse existing database schemas to help generate compatible synthetic data.

```bash
decoy parse-schema connection_string
```

This analyzes table structures and relationships to guide synthetic data generation.

## Limitations

Decoy is **not suitable for:**
- Analytics requiring statistical accuracy
- Machine learning training data that needs real data distributions
- Scenarios requiring patterns learned from actual datasets
- Production data replacement (always use in non-production environments)

## Testing

Run unit tests:
```bash
PYTHONPATH=. pytest
```

## Best Practices

1. **Use range() consistently**: Define row counts explicitly with `range(n)`
2. **Leverage oversample() for relationships**: Create realistic foreign key distributions
3. **Mix data sources strategically**: Combine Faker, Mimesis, and xeger for variety
4. **Export early and often**: Test generated data by exporting samples
5. **Introduce messy data gradually**: Add nulls and junk data after base generation
6. **Document your patterns**: Save SQL scripts for repeatable data generation
7. **Test with joins**: Validate relationships work correctly before scaling up
