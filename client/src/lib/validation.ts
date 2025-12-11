// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (
    password: string,
): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters',
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter',
        };
    }
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter',
        };
    }
    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one number',
        };
    }
    return { isValid: true };
};

// Vietnam phone number validation (+84 or 0)
export const isValidPhone = (phone: string): boolean => {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Match +84... or 0... format (10-11 digits)
    const phoneRegex = /^(\+84|84|0)[0-9]{9,10}$/;
    return phoneRegex.test(cleaned);
};

// Normalize phone to +84 format
export const normalizePhone = (phone: string): string => {
    const cleaned = phone.replace(/[\s-]/g, '');

    if (cleaned.startsWith('+84')) {
        return cleaned;
    }
    if (cleaned.startsWith('84')) {
        return `+${cleaned}`;
    }
    if (cleaned.startsWith('0')) {
        return `+84${cleaned.substring(1)}`;
    }
    return phone;
};

// Birthdate validation (must be at least 18 years old)
export const isValidBirthdate = (
    birthdate: string,
): { isValid: boolean; message?: string } => {
    const date = new Date(birthdate);
    const today = new Date();

    if (isNaN(date.getTime())) {
        return { isValid: false, message: 'Invalid date format' };
    }

    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    const actualAge =
        age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

    if (actualAge < 18) {
        return { isValid: false, message: 'You must be at least 18 years old' };
    }

    if (date > today) {
        return { isValid: false, message: 'Birthdate cannot be in the future' };
    }

    return { isValid: true };
};

// Format date for input (YYYY-MM-DD)
export const formatDateForInput = (date: Date | string): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
