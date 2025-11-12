-- Messy Data Example: Introducing Data Quality Issues
-- This script demonstrates how to add realistic data quality problems

-- Step 1: Create clean data
CREATE OR REPLACE TABLE customer_data AS (
    SELECT
        range as customer_id,
        faker_name() as customer_name,
        faker_email() as email,
        faker_phone_number() as phone
    FROM range(200)
);

-- Step 2: Introduce NULL values to simulate missing data
UPDATE customer_data
SET customer_name = messy_data_nullifier(customer_name);

UPDATE customer_data
SET email = messy_data_nullifier(email);

-- Step 3: View the messy data
SELECT * FROM customer_data
WHERE customer_name IS NULL OR email IS NULL
LIMIT 20;

-- Step 4: Check data quality statistics
SELECT
    COUNT(*) as total_records,
    SUM(CASE WHEN customer_name IS NULL THEN 1 ELSE 0 END) as null_names,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) as null_emails,
    SUM(CASE WHEN phone IS NULL THEN 1 ELSE 0 END) as null_phones
FROM customer_data;
