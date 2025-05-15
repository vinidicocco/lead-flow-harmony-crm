
/**
 * Generate a random password with specified length and complexity
 * @param length Length of the password (default 10)
 * @param includeNumbers Include numbers in the password (default true)
 * @param includeSpecial Include special characters in the password (default true)
 * @returns Generated password
 */
export const generatePassword = (
  length = 10,
  includeNumbers = true,
  includeSpecial = true
): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = lowercase + uppercase;
  if (includeNumbers) charset += numbers;
  if (includeSpecial) charset += special;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Ensure password contains at least one character from each required set
  if (
    !/[a-z]/.test(password) || 
    !/[A-Z]/.test(password) || 
    (includeNumbers && !/[0-9]/.test(password)) || 
    (includeSpecial && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password))
  ) {
    return generatePassword(length, includeNumbers, includeSpecial);
  }

  return password;
};

/**
 * Copy text to clipboard
 * @param text Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
};
