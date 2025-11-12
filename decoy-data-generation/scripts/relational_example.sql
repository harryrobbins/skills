-- Relational Data Example: Creating Tables with Foreign Keys
-- This script demonstrates how to create related tables using oversample()

-- Step 1: Create parent table (companies)
CREATE OR REPLACE TABLE companies AS (
    SELECT
        range as company_id,
        faker_company() as company_name,
        faker_catch_phrase() as tagline,
        faker_address() as headquarters
    FROM range(10)
);

-- Step 2: Create child table (employees) with foreign keys
CREATE OR REPLACE TABLE employees AS (
    SELECT
        range as employee_id,
        faker_name() as employee_name,
        faker_email() as email,
        faker_job() as job_title,
        oversample('companies', 'company_id') as company_id
    FROM range(50)
);

-- Step 3: View the relationship
SELECT
    e.employee_name,
    e.job_title,
    c.company_name,
    c.tagline
FROM employees e
JOIN companies c ON e.company_id = c.company_id
LIMIT 20;

-- Step 4: Analyze the distribution
SELECT
    company_name,
    COUNT(*) as employee_count
FROM employees e
JOIN companies c ON e.company_id = c.company_id
GROUP BY company_name
ORDER BY employee_count DESC;
