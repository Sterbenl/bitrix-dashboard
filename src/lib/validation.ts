export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Пароль должен содержать минимум 6 символов');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать минимум одну заглавную букву');
  }

  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать минимум одну цифру');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateForm = (formData: Record<string, string>): ValidationResult => {
  const errors: string[] = [];

  if (!validateEmail(formData.email)) {
    errors.push('Введите корректный email');
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (!validateName(formData.firstName)) {
    errors.push('Имя должно содержать минимум 2 символа');
  }

  if (!validateName(formData.lastName)) {
    errors.push('Фамилия должна содержать минимум 2 символа');
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.push('Введите корректный номер телефона');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
