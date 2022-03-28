export function transformMoneyToString(amount: number): string {
  return parseFloat(`${amount / 100}`).toFixed(2);
}
