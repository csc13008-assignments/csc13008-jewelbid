package jewelbid_dev.jewelbid.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO cho response thông tin danh mục
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String fullName;
    
    // Parent category (if this is a child category)
    private CategoryResponse parent;
    
    // Child categories (if this is a parent category)
    private List<CategoryResponse> children;
    
    // Calculated fields
    private Boolean isParentCategory;
    private Boolean isChildCategory;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
