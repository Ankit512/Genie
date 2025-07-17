import { validatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthBgColor } from '../../lib/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  const strength = validatePasswordStrength(password);
  
  if (!password) {
    return null;
  }

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthLabel = strengthLabels[strength.score] || 'Very Weak';

  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength bar */}
      <div className="flex space-x-1 mb-2">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-sm ${
              level <= strength.score
                ? getPasswordStrengthBgColor(strength.score)
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      {/* Strength label */}
      <div className={`text-sm font-medium ${getPasswordStrengthColor(strength.score)}`}>
        Password strength: {strengthLabel}
      </div>
      
      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="mt-1 text-xs text-gray-600 space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-start">
              <span className={`mr-1 ${strength.isValid ? 'text-green-500' : 'text-red-500'}`}>
                {strength.isValid ? '✓' : '•'}
              </span>
              {feedback}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
