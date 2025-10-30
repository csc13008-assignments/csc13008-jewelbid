package jewelbid_dev.jewelbid.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageResponse {
    
    private Long id;
    private String imageUrl;
    private String altText;
    private Integer displayOrder;
    private Boolean isMain;
    private LocalDateTime createdAt;
}
