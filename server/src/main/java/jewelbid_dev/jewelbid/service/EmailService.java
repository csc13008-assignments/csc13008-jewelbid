package jewelbid_dev.jewelbid.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${jewelbid.email.from}")
    private String fromEmail;

    @Value("${jewelbid.email.enabled}")
    private boolean emailEnabled;

    @Value("${jewelbid.otp.length}")
    private int otpLength;

    private static final String CHARACTERS = "0123456789";
    private final SecureRandom random = new SecureRandom();

    public String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return otp.toString();
    }

    public void sendOtpEmail(String toEmail, String otp) {
        if (!emailEnabled) {
            log.info("Email disabled. OTP for {}: {}", toEmail, otp);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("JewelBid - Password Reset OTP");
            message.setText(buildOtpEmailContent(otp));

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    public void sendWelcomeEmail(String toEmail, String fullName) {
        if (!emailEnabled) {
            log.info("Email disabled. Welcome email would be sent to: {}", toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to JewelBid!");
            message.setText(buildWelcomeEmailContent(fullName));

            mailSender.send(message);
            log.info("Welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
        }
    }

    public void sendPasswordChangeNotification(String toEmail, String fullName) {
        if (!emailEnabled) {
            log.info("Email disabled. Password change notification would be sent to: {}", toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("JewelBid - Password Changed");
            message.setText(buildPasswordChangeEmailContent(fullName));

            mailSender.send(message);
            log.info("Password change notification sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password change notification to: {}", toEmail, e);
        }
    }

    private String buildOtpEmailContent(String otp) {
        return String.format(
            "Dear User,\n\n" +
            "You have requested to reset your password for your JewelBid account.\n\n" +
            "Your OTP code is: %s\n\n" +
            "This code will expire in 10 minutes.\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "JewelBid Team",
            otp
        );
    }

    private String buildWelcomeEmailContent(String fullName) {
        return String.format(
            "Dear %s,\n\n" +
            "Welcome to JewelBid! Your account has been successfully created.\n\n" +
            "You can now start bidding on amazing jewelry items or become a seller to auction your own items.\n\n" +
            "Thank you for joining our community!\n\n" +
            "Best regards,\n" +
            "JewelBid Team",
            fullName
        );
    }

    private String buildPasswordChangeEmailContent(String fullName) {
        return String.format(
            "Dear %s,\n\n" +
            "Your password has been successfully changed.\n\n" +
            "If you did not make this change, please contact our support team immediately.\n\n" +
            "Best regards,\n" +
            "JewelBid Team",
            fullName
        );
    }
}
