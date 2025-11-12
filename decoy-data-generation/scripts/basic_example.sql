-- Basic Example: Generating Simple Synthetic Data with Faker
-- This script demonstrates basic data generation using faker functions

-- Generate a simple table with person data
CREATE OR REPLACE TABLE people AS (
    SELECT
        range as id,
        faker_name() as full_name,
        faker_email() as email,
        faker_phone_number() as phone,
        faker_address() as address
    FROM range(100)
);

-- View the generated data
SELECT * FROM people LIMIT 10;
