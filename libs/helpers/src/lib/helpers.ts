export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /^09\d{9}$/;
  return regex.test(phoneNumber);
}

/**
 * Determines if the input is an Iranian phone number or email address
 * @param {string} input - The value to check
 * @returns {'phone' | 'email' | 'invalid'} - The type of input or 'invalid'
 */
export function detectInputType(input: string): 'phone' | 'email' | 'invalid' {
  // Trim and clean the input
  const cleanedInput = input.trim();

  // Check if it's an Iranian phone number
  if (isIranianPhoneNumber(cleanedInput)) {
    return 'phone';
  }

  // Check if it's a valid email
  if (isValidEmail(cleanedInput)) {
    return 'email';
  }

  // If neither matches
  return 'invalid';
}

// Iranian phone number validation
export function isIranianPhoneNumber(input: string): boolean {
  // Only matches 09 followed by 9 digits (11 digits total)
  const irPhoneRegex = /^09\d{9}$/;

  // Remove any non-digit characters
  const digitsOnly = input.replace(/\D/g, '');

  // Must be exactly 11 digits starting with 09
  return irPhoneRegex.test(digitsOnly) && digitsOnly.length === 11;
}

// Email validation
export function isValidEmail(input: string): boolean {
  // Standard email regex (RFC 5322 compliant)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
}

export function createIdentityObject(identityInput: string): { email: string } | { phoneNumber: string } | null {
  const trimmedInput = identityInput.trim();

  if (isValidEmail(trimmedInput)) {
    return { email: trimmedInput };
  }

  if (isIranianPhoneNumber(trimmedInput)) {
    return { phoneNumber: trimmedInput };
  }

  return null;
}
