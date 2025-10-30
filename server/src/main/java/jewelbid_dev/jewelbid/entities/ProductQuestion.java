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
    @NotBlank(message = "Question content is required")
    private String question;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questioner_id", nullable = false)
    @NotNull(message = "Questioner is required")
    private User questioner;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public boolean isAnswered() {
        return answer != null && !answer.trim().isEmpty();
    }
    
    public void answerQuestion(String answerText) {
        this.answer = answerText;
        this.answeredAt = LocalDateTime.now();
    }
}
