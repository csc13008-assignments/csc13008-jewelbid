package jewelbid_dev.jewelbid.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jewelbid_dev.jewelbid.enums.BidType;
import jewelbid_dev.jewelbid.validation.ValidBidAmount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO cho yêu cầu đặt giá
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ValidBidAmount
public class PlaceBidRequest {
    
    @NotNull(message = "Số tiền đấu giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền đấu giá phải lớn hơn 0")
    private BigDecimal bidAmount;
    
    // Cho automatic bidding
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền tối đa phải lớn hơn 0")
    private BigDecimal maxBidAmount;
    
    @NotNull(message = "Loại đấu giá không được để trống")
    private BidType bidType;
}
