-- Export Example: Saving Generated Data to Files
-- This script demonstrates how to export synthetic data to various formats

-- Step 1: Generate a dataset
CREATE OR REPLACE TABLE export_demo AS (
    SELECT
        range as id,
        faker_name() as name,
        faker_email() as email,
        faker_company() as company,
        CAST(random() * 100000 as INTEGER) as salary
    FROM range(500)
);

-- Step 2: Export to CSV
COPY (SELECT * FROM export_demo)
TO 'synthetic_data.csv' WITH (HEADER 1, DELIMITER ',');

-- Step 3: Export to Parquet
COPY (SELECT * FROM export_demo)
TO 'synthetic_data.parquet' (FORMAT PARQUET);

-- Step 4: Export to JSON
COPY (SELECT * FROM export_demo)
TO 'synthetic_data.json';

-- Step 5: Export a filtered subset
COPY (SELECT * FROM export_demo WHERE salary > 50000)
TO 'high_salary_employees.csv' WITH (HEADER 1, DELIMITER ',');
