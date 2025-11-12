---
name: decoy-data-generation
description: Generate synthetic test data using the Decoy library built on DuckDB. Use this skill when users need to create fake/synthetic data for testing, development, or non-production environments. Applies when users mention generating test data, creating sample datasets, populating databases with fake data, or need synthetic data without accessing real production data. Also relevant when users want to create relational test data, export synthetic data to CSV/Parquet/JSON, or introduce realistic data quality issues for testing.
---

# Decoy Data Generation

## Overview

Enable generation of realistic synthetic test data using Decoy, a Python-based tool built on DuckDB that integrates Faker, Mimesis, and custom data generation functions. Decoy generates data randomly without requiring access to real data and does not learn from real data patterns, making it safe for non-production environments.

## When to Use This Skill

Activate this skill when users need to:
- Generate synthetic/fake data for testing or development
- Create sample datasets without using real production data
- Populate databases with realistic test data
- Build relational test data with foreign key relationships
- Export generated data to CSV, Parquet, or JSON formats
- Introduce data quality issues (NULLs, junk data) for testing data validation
- Generate data matching specific patterns or formats
- Create large datasets for performance testing

## Quick Start

### Installation Check

Verify Decoy is installed and available:
```bash
decoy --help
```

If not installed, guide the user through installation (Python 3.10+ required):
```bash
pip install --editable .
```

### Basic Usage Pattern

1. **Write SQL scripts** using Decoy functions
2. **Execute scripts** via CLI or REPL
3. **Export data** to desired format

## Core Capabilities

### 1. Simple Data Generation

Generate basic synthetic data using Faker functions:

```sql
CREATE TABLE users AS (
    SELECT
        range as id,
        faker_name() as name,
        faker_email() as email,
        faker_phone_number() as phone
    FROM range(100)
);
```

**Common functions:**
- `faker_name()`, `faker_email()`, `faker_address()`
- `faker_company()`, `faker_job()`, `faker_date()`
- `mimesis_person_full_name()`, `mimesis_person_email()`

Refer to `references/api_reference.md` for the complete function list.

### 2. Relational Data with Foreign Keys

Create related tables using `oversample()` to distribute foreign key references:

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
        faker_name() as name,
        oversample('departments', 'dept_id') as dept_id
    FROM range(50)
);
```

The `oversample()` function randomly selects values from the parent table, creating realistic uneven distribution.

### 3. Pattern-Based Generation with xeger()

Generate data matching specific regex patterns:

```sql
CREATE TABLE products AS (
    SELECT
        xeger('[A-Z]{3}-[0-9]{6}') as sku,
        xeger('\(\+0[0-9]{2}\) 07[0-9]{3} [0-9]{6}') as phone,
        faker_name() as product_name
    FROM range(100)
);
```

Use `xeger()` for:
- Custom ID formats
- Formatted phone numbers
- License plates, serial numbers
- Any data with specific format requirements

### 4. Mixing Data Sources

Combine Faker, Mimesis, and xeger in a single table:

```sql
CREATE TABLE mixed_data AS (
    SELECT
        faker_name() as name,                    -- Faker
        mimesis_person_email() as email,         -- Mimesis
        xeger('[A-Z]{2}[0-9]{6}') as code       -- Pattern
    FROM range(100)
);
```

### 5. Introducing Data Quality Issues

Add realistic data problems for testing validation logic:

```sql
-- Create clean data
CREATE TABLE customer_data AS (
    SELECT range as id, faker_name() as name FROM range(100)
);

-- Introduce NULL values
UPDATE customer_data SET name = messy_data_nullifier(name);

-- Introduce junk data
UPDATE customer_data SET name = messy_data_junk(name);
```

### 6. Exporting Data

Export generated data to various formats:

```sql
-- CSV export
COPY (SELECT * FROM users)
TO 'users.csv' WITH (HEADER 1, DELIMITER ',');

-- Parquet export
COPY (SELECT * FROM users)
TO 'users.parquet' (FORMAT PARQUET);

-- JSON export
COPY (SELECT * FROM users)
TO 'users.json';
```

## Working with Decoy

### Execution Methods

**Execute SQL scripts:**
```bash
decoy exec script.sql
```

**Interactive REPL:**
```bash
decoy repl
```
Then type SQL commands interactively.

**Jupyter Notebooks:**
```bash
decoy kernel-install
jupyter lab
```
Use Decoy functions in notebook cells.

### Recommended Workflow

When users request synthetic data generation:

1. **Understand requirements**: Clarify the data structure, relationships, and volume needed
2. **Choose appropriate functions**: Select from Faker, Mimesis, or xeger based on data type
3. **Write SQL script**: Create tables using Decoy functions
4. **Test with small samples**: Generate a small dataset first (e.g., `range(10)`)
5. **Verify relationships**: If using `oversample()`, check JOIN queries work correctly
6. **Scale up**: Increase to full dataset size (e.g., `range(10000)`)
7. **Export if needed**: Use COPY commands to save data to files

### Example Scripts

The `scripts/` directory contains complete working examples:
- `basic_example.sql` - Simple data generation
- `relational_example.sql` - Tables with foreign keys
- `mixed_sources_example.sql` - Combining multiple libraries
- `messy_data_example.sql` - Adding data quality issues
- `export_example.sql` - Exporting to various formats
- `regex_pattern_example.sql` - Custom format generation

Reference these scripts when users need similar patterns.

## Key Concepts

### The range() Function

`range(n)` generates integers from 0 to n-1, serving as:
- Primary key values
- Row count specifier
- The basis for all data generation

```sql
-- Generate 1000 rows with sequential IDs
SELECT range as id, faker_name() as name FROM range(1000);
```

### The oversample() Function

Creates realistic foreign key distributions by randomly selecting values from a parent table:

```sql
oversample('parent_table_name', 'column_name')
```

This enables creating child tables with more rows than parent tables.

### SQL Standard Operations

Decoy uses DuckDB SQL syntax, so all standard SQL operations work:
- `JOIN`, `WHERE`, `GROUP BY`, `ORDER BY`
- `UPDATE`, `DELETE`, `INSERT`
- Aggregate functions: `COUNT()`, `SUM()`, `AVG()`
- Window functions and CTEs

## Common Patterns

### E-commerce Data
```sql
CREATE TABLE products AS (
    SELECT range as id, faker_company() as name FROM range(50)
);

CREATE TABLE orders AS (
    SELECT
        range as order_id,
        oversample('products', 'id') as product_id,
        faker_date() as order_date,
        CAST(random() * 1000 as INTEGER) as amount
    FROM range(500)
);
```

### User Registration Data
```sql
CREATE TABLE users AS (
    SELECT
        range as user_id,
        faker_name() as name,
        faker_email() as email,
        faker_date() as signup_date,
        xeger('[A-Z]{2}[0-9]{6}') as user_code
    FROM range(1000)
);
```

### Multi-Level Relationships
```sql
CREATE TABLE companies AS (...);
CREATE TABLE departments AS (...with company FK...);
CREATE TABLE employees AS (...with department FK...);
```

## Important Limitations

Decoy is **not suitable for:**
- Analytics requiring statistical accuracy
- Machine learning training data needing real distributions
- Scenarios requiring patterns learned from actual datasets
- Production data replacement

Decoy generates completely random data based only on function calls, not real data patterns.

## Resources

### references/api_reference.md
Complete documentation of all available Decoy functions including:
- All Faker functions with descriptions
- All Mimesis functions with localization support
- xeger() pattern syntax and examples
- Data manipulation functions (oversample, messy_data_*)
- Export options and formats
- Best practices and limitations

Load this reference when users need:
- Specific function names or syntax
- Details on function capabilities
- Export format specifications
- Advanced usage patterns

### scripts/ Directory
Six complete SQL example scripts demonstrating:
- Basic data generation
- Relational data with foreign keys
- Mixing multiple data sources
- Introducing data quality issues
- Exporting to various formats
- Custom regex patterns

Reference or provide these scripts directly when users request similar functionality.

## Tips for Effective Use

1. **Start small**: Test with `range(10)` before scaling to `range(10000)`
2. **Verify relationships early**: Check JOINs work with small datasets
3. **Use descriptive aliases**: Name columns clearly for better understanding
4. **Document patterns**: Save working SQL scripts for reuse
5. **Test exports promptly**: Verify output format meets requirements
6. **Combine thoughtfully**: Mix Faker, Mimesis, and xeger strategically
7. **Add messiness last**: Generate clean data first, then introduce issues

## Troubleshooting

**Function not found errors**: Check function name follows `faker_*` or `mimesis_*_*` pattern

**Oversample() issues**: Verify parent table exists and column name is correct

**Export failures**: Ensure file path is writable and format syntax is correct

**Pattern generation problems**: Test xeger() regex patterns with small samples first

For detailed function reference and advanced patterns, consult `references/api_reference.md`.
