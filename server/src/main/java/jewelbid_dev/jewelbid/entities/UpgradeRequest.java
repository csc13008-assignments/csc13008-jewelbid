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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_admin_id")
    private User processedByAdmin;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public boolean isProcessed() {
        return processed;
    }
    
    public boolean isPending() {
        return !processed;
    }
    
    public void approve(User admin, String comment) {
        this.approved = true;
        this.processed = true;
        this.processedAt = LocalDateTime.now();
        this.processedByAdmin = admin;
        this.adminComment = comment;
    }
    
    public void reject(User admin, String comment) {
        this.approved = false;
        this.processed = true;
        this.processedAt = LocalDateTime.now();
        this.processedByAdmin = admin;
        this.adminComment = comment;
    }
}
