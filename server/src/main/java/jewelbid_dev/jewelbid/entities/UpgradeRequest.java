package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho yêu cầu nâng cấp tài khoản từ Bidder lên Seller
 */
@Entity
@Table(name = "upgrade_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean approved = false;
    
    @Column(name = "processed")
    @Builder.Default
    private Boolean processed = false;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "admin_comment", columnDefinition = "TEXT")
    private String adminComment;
    
    // User requesting upgrade
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "Người dùng không được để trống")
    private User user;
    
    // Admin who processed the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_admin_id")
    private User processedByAdmin;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Kiểm tra xem yêu cầu đã được xử lý chưa
     * @return true nếu đã được xử lý
     */
    public boolean isProcessed() {
        return processed;
    }
    
    /**
     * Kiểm tra xem yêu cầu có đang chờ xử lý không
     * @return true nếu đang chờ xử lý
     */
    public boolean isPending() {
        return !processed;
    }
    
    /**
     * Duyệt yêu cầu nâng cấp
     * @param admin admin xử lý
     * @param comment nhận xét của admin
     */
    public void approve(User admin, String comment) {
        this.approved = true;
        this.processed = true;
        this.processedAt = LocalDateTime.now();
        this.processedByAdmin = admin;
        this.adminComment = comment;
    }
    
    /**
     * Từ chối yêu cầu nâng cấp
     * @param admin admin xử lý
     * @param comment lý do từ chối
     */
    public void reject(User admin, String comment) {
        this.approved = false;
        this.processed = true;
        this.processedAt = LocalDateTime.now();
        this.processedByAdmin = admin;
        this.adminComment = comment;
    }
}
