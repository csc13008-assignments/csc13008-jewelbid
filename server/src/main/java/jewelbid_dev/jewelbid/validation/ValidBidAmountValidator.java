package jewelbid_dev.jewelbid.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jewelbid_dev.jewelbid.enums.BidType;
import jewelbid_dev.jewelbid.payload.request.PlaceBidRequest;

import java.math.BigDecimal;

/**
 * Validator implementation cho ValidBidAmount annotation
 */
public class ValidBidAmountValidator implements ConstraintValidator<ValidBidAmount, PlaceBidRequest> {
    
    @Override
    public void initialize(ValidBidAmount constraintAnnotation) {
        // Initialization logic if needed
    }
    
    @Override
    public boolean isValid(PlaceBidRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }
        
        BigDecimal bidAmount = request.getBidAmount();
        BigDecimal maxBidAmount = request.getMaxBidAmount();
        BidType bidType = request.getBidType();
        
        if (bidAmount == null || bidType == null) {
            return false;
        }
        
        // Nếu là automatic bidding, maxBidAmount phải được cung cấp và >= bidAmount
        if (bidType == BidType.AUTOMATIC) {
            if (maxBidAmount == null) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Số tiền tối đa không được để trống cho đấu giá tự động")
                       .addConstraintViolation();
                return false;
            }
            
            if (maxBidAmount.compareTo(bidAmount) < 0) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Số tiền tối đa phải lớn hơn hoặc bằng số tiền đấu giá")
                       .addConstraintViolation();
                return false;
            }
        }
        
        return true;
    }
}
