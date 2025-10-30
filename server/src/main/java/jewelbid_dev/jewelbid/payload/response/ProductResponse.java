package jewelbid_dev.jewelbid.payload.response;

import jewelbid_dev.jewelbid.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO cho response thông tin sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    
    private Long id;
    private String name;
    private String description;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private BigDecimal bidIncrement;
    private BigDecimal buyNowPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean autoExtend;
    private ProductStatus status;
    private Integer bidCount;
    private Integer viewCount;
    private String mainImageUrl;
    
    // Seller information
    private UserResponse seller;
    
    // Category information
    private CategoryResponse category;
    
    // Current highest bidder (masked)
    private String highestBidderName;
    
    // Additional images
    private List<ProductImageResponse> images;
    
    // Calculated fields
    private Boolean isActive;
    private Boolean isEnded;
    private Boolean isNewlyPosted;
    private Long minutesRemaining;
    private BigDecimal minimumNextBid;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
