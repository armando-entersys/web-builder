INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
    'clxadmin001',
    'admin@web-builder.com',
    'Admin',
    '$2b$10$MBSzGp0WpmMCmpIXueDSsu8DA2kBE1S7WFzhcPWmBi/u3xIQG8g3q',
    'ADMIN',
    NOW(),
    NOW()
);

SELECT id, email, name, role FROM users WHERE email='admin@web-builder.com';
