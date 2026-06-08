export interface Plan {
  id: "free" | "month" | "year";
  name: string;
  price: number;
  currency: string;
  interval: "free" | "month" | "year";
  priceId: string | null;
  isFree: boolean;
}

export const availablePlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "USD",
    interval: "free",
    priceId: null,
    isFree: true,
  },
  {
    id: "month",
    name: "Pro Monthly",
    price: 9.99,
    currency: "USD",
    interval: "month",
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    isFree: false,
  },
  {
    id: "year",
    name: "Pro Yearly",
    price: 99.99,
    currency: "USD",
    interval: "year",
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    isFree: false,
  },
];

export const getPriceIdFromType = (planType: Plan["id"]): string | null => {
  if (planType === "free") return null;

  const priceIdMap: Record<string, string | undefined> = {
    month: process.env.STRIPE_MONTHLY_PRICE_ID,
    year: process.env.STRIPE_YEARLY_PRICE_ID,
  };

  const priceId = priceIdMap[planType];
  if (!priceId) {
    console.error(
      `Missing env var for plan "${planType}". ` +
      `Check STRIPE_MONTHLY_PRICE_ID and STRIPE_YEARLY_PRICE_ID in .env.local`
    );
    return null;
  }
  return priceId;
};
