package jewelbid_dev.jewelbid.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jewelbid_dev.jewelbid.enums.BidType;
import jewelbid_dev.jewelbid.payload.request.PlaceBidRequest;

import java.math.BigDecimal;

public class ValidBidAmountValidator implements ConstraintValidator<ValidBidAmount, PlaceBidRequest> {
    
    @Override
    public void initialize(ValidBidAmount constraintAnnotation) {
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
        
        if (bidType == BidType.AUTOMATIC) {
            if (maxBidAmount == null) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Maximum bid amount is required for automatic bidding")
                       .addConstraintViolation();
                return false;
            }
            
            if (maxBidAmount.compareTo(bidAmount) < 0) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Maximum bid amount must be greater than or equal to bid amount")
                       .addConstraintViolation();
                return false;
            }
        }
        
        return true;
    }
}
