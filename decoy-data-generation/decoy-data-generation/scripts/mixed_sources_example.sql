-- Mixed Data Sources Example: Combining Faker, Mimesis, and xeger
-- This script demonstrates how to use multiple data generation libraries together

CREATE OR REPLACE TABLE users AS (
    SELECT
        range as user_id,
        faker_name() as name,                           -- From Faker
        mimesis_person_email() as email,                -- From Mimesis
        xeger('[A-Z]{2}[0-9]{6}') as user_code,        -- Custom pattern
        faker_date() as signup_date,                    -- From Faker
        mimesis_person_phone_number() as phone          -- From Mimesis
    FROM range(100)
);

-- View the generated data
SELECT * FROM users LIMIT 10;
