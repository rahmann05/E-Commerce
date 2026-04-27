import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 10;
const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

export function isPasswordHashed(value: string | null | undefined): boolean {
  if (!value) return false;
  return BCRYPT_PREFIX.test(value);
}

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(
  plainTextPassword: string,
  storedPassword: string | null | undefined
): Promise<boolean> {
  if (!storedPassword) return false;

  if (isPasswordHashed(storedPassword)) {
    return bcrypt.compare(plainTextPassword, storedPassword);
  }

  return storedPassword === plainTextPassword;
}
