package jewelbid_dev.jewelbid.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho câu hỏi về sản phẩm
 */
@Entity
@Table(name = "product_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String question;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
    
    // Questioner (bidder)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questioner_id", nullable = false)
    @NotNull(message = "Người hỏi không được để trống")
    private User questioner;
    
    // Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Sản phẩm không được để trống")
    private Product product;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Kiểm tra xem câu hỏi đã được trả lời chưa
     * @return true nếu đã được trả lời
     */
    public boolean isAnswered() {
        return answer != null && !answer.trim().isEmpty();
    }
    
    /**
     * Trả lời câu hỏi
     * @param answerText nội dung trả lời
     */
    public void answerQuestion(String answerText) {
        this.answer = answerText;
        this.answeredAt = LocalDateTime.now();
    }
}
