package jewelbid_dev.jewelbid.security;

import jewelbid_dev.jewelbid.enums.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {

    public static UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    public static UUID getCurrentUserId() {
        UserPrincipal user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    public static String getCurrentUserEmail() {
        UserPrincipal user = getCurrentUser();
        return user != null ? user.getEmail() : null;
    }

    public static UserRole getCurrentUserRole() {
        UserPrincipal user = getCurrentUser();
        if (user != null && user.getRole() != null) {
            return UserRole.valueOf(user.getRole());
        }
        return null;
    }

    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               authentication.getPrincipal() instanceof UserPrincipal;
    }

    public static boolean hasRole(UserRole role) {
        UserRole currentRole = getCurrentUserRole();
        return currentRole != null && currentRole.equals(role);
    }

    public static boolean hasAnyRole(UserRole... roles) {
        UserRole currentRole = getCurrentUserRole();
        if (currentRole == null) {
            return false;
        }
        
        for (UserRole role : roles) {
            if (currentRole.equals(role)) {
                return true;
            }
        }
        
        return false;
    }
}
