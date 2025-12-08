-- Seed data for system settings (auto-renewal configuration)

INSERT INTO system_settings (id, key, value, description, "valueType", created_at, updated_at)
VALUES
    (gen_random_uuid(), 'auto_renewal_trigger_minutes', '5', 'Minutes before end time to trigger auto-renewal when new bid occurs', 'number', NOW(), NOW()),
    (gen_random_uuid(), 'auto_renewal_extension_minutes', '10', 'Minutes to extend auction end time during auto-renewal', 'number', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;
