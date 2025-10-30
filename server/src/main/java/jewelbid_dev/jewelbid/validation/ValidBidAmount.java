package jewelbid_dev.jewelbid.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Custom validation annotation để kiểm tra bid amount có hợp lệ không
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidBidAmountValidator.class)
@Documented
public @interface ValidBidAmount {
    
    String message() default "Số tiền đấu giá không hợp lệ";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
