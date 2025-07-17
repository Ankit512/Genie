export interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 1: weak, 2: fair, 3: good, 4: strong)
  feedback: string[];
  isValid: boolean; // true if meets minimum requirements (score >= 2)
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Check length
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else if (password.length >= 8) {
    score += 1;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password should contain at least one special character');
  } else {
    score += 1;
  }

  // Additional checks for stronger passwords
  if (password.length >= 12) {
    score += 1;
  }

  // Check for common patterns (reduce score)
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /(.)\1{2,}/ // repeated characters
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 1);
      feedback.push('Avoid common patterns and repeated characters');
      break;
    }
  }

  // Cap the score at 4
  score = Math.min(score, 4);

  // Determine if password meets minimum requirements (medium strength)
  const isValid = score >= 2 && password.length >= 8;

  return {
    score,
    feedback: feedback.length > 0 ? feedback : getPositiveFeedback(score),
    isValid
  };
}

function getPositiveFeedback(score: number): string[] {
  switch (score) {
    case 0:
    case 1:
      return ['Password is too weak'];
    case 2:
      return ['Password strength: Fair - meets minimum requirements'];
    case 3:
      return ['Password strength: Good - well protected'];
    case 4:
      return ['Password strength: Strong - excellent security'];
    default:
      return ['Password strength: Fair'];
  }
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-500';
    case 2:
      return 'text-yellow-500';
    case 3:
      return 'text-blue-500';
    case 4:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

export function getPasswordStrengthBgColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}
