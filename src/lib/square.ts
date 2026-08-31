import { SquareClient, SquareEnvironment } from "square";

// Server-only — SQUARE_ACCESS_TOKEN must never reach the client. The Web
// Payments SDK card form (loaded client-side) only ever sees the public
// NEXT_PUBLIC_SQUARE_APPLICATION_ID / NEXT_PUBLIC_SQUARE_LOCATION_ID.
export function getSquareClient() {
  return new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN!,
    environment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}
