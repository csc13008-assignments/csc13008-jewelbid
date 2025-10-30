package jewelbid_dev.jewelbid.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Custom validation annotation để kiểm tra password và confirmPassword có khớp nhau không
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Documented
public @interface PasswordMatches {
    
    String message() default "Mật khẩu và xác nhận mật khẩu không khớp";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
