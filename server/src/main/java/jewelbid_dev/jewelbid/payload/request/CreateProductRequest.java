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

/**
 * DTO cho yêu cầu tạo sản phẩm đấu giá
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {
    
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;
    
    @NotBlank(message = "Mô tả sản phẩm không được để trống")
    private String description;
    
    @NotNull(message = "Giá khởi điểm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá khởi điểm phải lớn hơn 0")
    private BigDecimal startingPrice;
    
    @NotNull(message = "Bước giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bước giá phải lớn hơn 0")
    private BigDecimal bidIncrement;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá mua ngay phải lớn hơn 0")
    private BigDecimal buyNowPrice;
    
    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime endTime;
    
    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
    
    private Boolean autoExtend = false;
    
    private List<String> imageUrls;
}
