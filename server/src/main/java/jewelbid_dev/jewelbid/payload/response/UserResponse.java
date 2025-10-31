package jewelbid_dev.jewelbid.payload.response;

import jewelbid_dev.jewelbid.enums.UserRole;
import jewelbid_dev.jewelbid.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private UUID id;
    private String email;
    private String fullName;
    private String address;
    private LocalDate dateOfBirth;
    private UserRole role;
    private UserStatus status;
    private Boolean emailVerified;
    
    private Integer positiveRatings;
    private Integer negativeRatings;
    private Integer totalRatings;
    private Double positiveRatingPercentage;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
