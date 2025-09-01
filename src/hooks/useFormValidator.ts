import { useState } from "react";

type ValidationRule = {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
};

type FieldRules = Record<string, ValidationRule>;
type Errors = Record<string, string>;

export const useFormValidator = (rules: FieldRules) => {
    const [errors, setErrors] = useState<Errors>({});

    const validateField = (field: string, value: string): string | null => {
        const rule = rules[field];
        if (!rule) return null;

        const trimmed = value.trim();

        if (rule.required && !trimmed) {
            return "This field is required.";
        }

        if (rule.minLength && trimmed.length < rule.minLength) {
            return `Minimum length is ${rule.minLength}.`;
        }

        if (rule.maxLength && trimmed.length > rule.maxLength) {
            return `Maximum length is ${rule.maxLength}.`;
        }

        return null;
    };

    const validate = (values: Record<string, string>): boolean => {
        const newErrors: Errors = {};
        for (const field in rules) {
            const error = validateField(field, values[field] || "");
            if (error) newErrors[field] = error;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSingleField = (field: string, value: string) => {
        const error = validateField(field, value);
        setErrors((prev) => ({
            ...prev,
            [field]: error || "",
        }));
    };

    return { errors, validate, validateSingleField };
};
