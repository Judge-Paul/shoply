const NairaInUSD = 1560;

export function convertToNaira(priceInUSD: number) {
  return `₦ ${(priceInUSD * NairaInUSD).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
}
