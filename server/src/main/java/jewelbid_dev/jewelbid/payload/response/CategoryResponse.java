package jewelbid_dev.jewelbid.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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
    
    private CategoryResponse parent;
    
    private List<CategoryResponse> children;
    
    private Boolean isParentCategory;
    private Boolean isChildCategory;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
