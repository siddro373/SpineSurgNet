export function validateNPI(npi: string): boolean {
  if (!/^\d{10}$/.test(npi)) return false;

  const prefixed = "80840" + npi;
  const digits = prefixed.split("").map(Number);

  let sum = 0;
  for (let i = digits.length - 2; i >= 0; i--) {
    let digit = digits[i];
    if ((digits.length - 1 - i) % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[digits.length - 1];
}
