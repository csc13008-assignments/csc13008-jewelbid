package jewelbid_dev.jewelbid.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotBlank(message = "Product description is required")
    private String description;
    
    @NotNull(message = "Starting price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Starting price must be greater than 0")
    private BigDecimal startingPrice;
    
    @NotNull(message = "Bid increment is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bid increment must be greater than 0")
    private BigDecimal bidIncrement;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Buy now price must be greater than 0")
    private BigDecimal buyNowPrice;
    
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    @Builder.Default
    private Boolean autoExtend = false;
    
    private List<String> imageUrls;
}
