package bg.tuvarna.devicebackend.annotations;

import bg.tuvarna.devicebackend.validators.ValidEmailValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidEmailValidator.class)
public @interface ValidEmail {
    String message() default "Email not valid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}