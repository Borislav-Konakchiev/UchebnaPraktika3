package bg.tuvarna.devicebackend.validators;

import bg.tuvarna.devicebackend.annotations.ValidEmail;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidEmailValidator implements ConstraintValidator<ValidEmail, String> {
    private final String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        return value.matches(regex);
    }
}