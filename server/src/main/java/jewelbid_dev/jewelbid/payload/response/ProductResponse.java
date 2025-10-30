package jewelbid_dev.jewelbid.payload.response;

import jewelbid_dev.jewelbid.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    
    private UserResponse seller;
    
    private CategoryResponse category;
    
    private String highestBidderName;
    
    private List<ProductImageResponse> images;
    
    private Boolean isActive;
    private Boolean isEnded;
    private Boolean isNewlyPosted;
    private Long minutesRemaining;
    private BigDecimal minimumNextBid;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
