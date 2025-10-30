package jewelbid_dev.jewelbid.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jewelbid_dev.jewelbid.validation.PasswordMatches;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho yêu cầu đăng ký người dùng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@PasswordMatches
public class UserRegistrationRequest {
    
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
    
    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String confirmPassword;
    
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    
    private String address;
    
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "reCAPTCHA không được để trống")
    private String recaptchaToken;
}
