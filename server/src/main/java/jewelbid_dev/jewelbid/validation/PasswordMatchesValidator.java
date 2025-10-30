package jewelbid_dev.jewelbid.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jewelbid_dev.jewelbid.payload.request.UserRegistrationRequest;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, UserRegistrationRequest> {
    
    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
    }
    
    @Override
    public boolean isValid(UserRegistrationRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }
        
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();
        
        if (password == null || confirmPassword == null) {
            return false;
        }
        
        return password.equals(confirmPassword);
    }
}
