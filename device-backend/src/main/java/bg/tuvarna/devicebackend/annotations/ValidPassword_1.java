package bg.tuvarna.devicebackend.annotations;

import bg.tuvarna.devicebackend.validators.ValidPasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidPasswordValidator.class)
public @interface ValidPassword {
    String message() default "Password not valid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}