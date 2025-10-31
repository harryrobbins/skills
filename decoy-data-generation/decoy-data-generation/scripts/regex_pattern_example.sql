-- Regex Pattern Example: Using xeger() for Custom Data Formats
-- This script demonstrates advanced pattern-based data generation

CREATE OR REPLACE TABLE custom_formats AS (
    SELECT
        range as id,
        -- Product SKUs
        xeger('[A-Z]{3}-[0-9]{6}') as product_sku,

        -- International phone numbers
        xeger('\(\+0[0-9]{2}\) 07[0-9]{3} [0-9]{6}') as phone,

        -- License plate numbers
        xeger('[A-Z]{2}[0-9]{2} [A-Z]{3}') as license_plate,

        -- Serial numbers
        xeger('[0-9]{4}-[A-Z]{4,6}-[1-9]+') as serial_number,

        -- Postal codes
        xeger('[A-Z][0-9][A-Z] [0-9][A-Z][0-9]') as postal_code,

        -- Credit card numbers (last 4 digits)
        xeger('\*\*\*\* \*\*\*\* \*\*\*\* [0-9]{4}') as masked_cc
    FROM range(50)
);

-- View the generated patterns
SELECT * FROM custom_formats LIMIT 10;
