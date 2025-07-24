const NairaInUSD = 1560;

export function convertToUSDNumber(priceInNaira: number) {
  return priceInNaira / NairaInUSD;
}

export function convertToNaira(priceInUSD: number) {
  return `₦ ${(priceInUSD * NairaInUSD).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
}
