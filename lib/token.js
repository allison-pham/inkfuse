

export default function secretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT Secret key doesn't match");
  }

  return new TextEncoder().encode(secret);
}

