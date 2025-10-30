package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity đại diện cho danh mục sản phẩm (hỗ trợ 2 cấp)
 */
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "deleted = false")
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    // Self-referencing relationship cho parent-child
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;
    
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Category> children;
    
    // Soft delete
    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;
    
    /**
     * Kiểm tra xem có phải là danh mục cha không
     * @return true nếu là danh mục cha (không có parent)
     */
    public boolean isParentCategory() {
        return parent == null;
    }
    
    /**
     * Kiểm tra xem có phải là danh mục con không
     * @return true nếu là danh mục con (có parent)
     */
    public boolean isChildCategory() {
        return parent != null;
    }
    
    /**
     * Lấy tên đầy đủ của danh mục (bao gồm parent nếu có)
     * @return tên đầy đủ của danh mục
     */
    public String getFullName() {
        if (isChildCategory()) {
            return parent.getName() + " → " + name;
        }
        return name;
    }
    
    /**
     * Kiểm tra xem có thể xóa danh mục không
     * @return true nếu không có sản phẩm nào trong danh mục này
     */
    public boolean canBeDeleted() {
        return products == null || products.isEmpty();
    }
    
    /**
     * Soft delete danh mục
     */
    public void softDelete() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
    }
}
