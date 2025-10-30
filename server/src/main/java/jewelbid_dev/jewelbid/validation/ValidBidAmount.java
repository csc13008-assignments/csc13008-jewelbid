package jewelbid_dev.jewelbid.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidBidAmountValidator.class)
@Documented
public @interface ValidBidAmount {
    
    String message() default "Invalid bid amount";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
