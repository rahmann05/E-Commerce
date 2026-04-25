-- ============================================================
-- Novure E-Commerce — PostgreSQL Schema (reference)
-- ============================================================

-- Note:
-- Source of truth tetap `prisma/schema.prisma`.
-- Jalankan migrasi Prisma untuk sinkronisasi:
--   npx prisma migrate dev
--   npx prisma db seed

-- Optional seed baseline user + voucher
INSERT INTO "User" ("id", "name", "email", "password", "phone", "address", "paymentPreference", "role", "createdAt", "updatedAt")
VALUES
  ('usr_1', 'Alex Rivera', 'demo@novure.com', 'novure123', '+62 812 3456 7890', 'Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan 12190', 'BCA Virtual Account', 'USER', NOW(), NOW()),
  ('usr_2', 'Admin Novure', 'admin@novure.com', 'admin123', NULL, NULL, NULL, 'ADMIN', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Voucher" ("id", "code", "title", "discountPct", "isActive", "createdAt", "updatedAt")
VALUES
  ('voucher_welcome', 'WELCOME10', 'Diskon 10% untuk pembelian berikutnya', 10, TRUE, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

