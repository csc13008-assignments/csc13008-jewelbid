package jewelbid_dev.jewelbid.service;

import jewelbid_dev.jewelbid.enums.UserRole;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AccessControlService {

    private final Map<UserRole, Integer> roleHierarchy;

    public AccessControlService() {
        roleHierarchy = new HashMap<>();
        roleHierarchy.put(UserRole.GUEST, 1);
        roleHierarchy.put(UserRole.BIDDER, 2);
        roleHierarchy.put(UserRole.SELLER, 3);
        roleHierarchy.put(UserRole.ADMIN, 4);
    }

    public boolean hasRole(UserRole userRole, UserRole requiredRole) {
        if (userRole == null || requiredRole == null) {
            return false;
        }
        
        Integer userLevel = roleHierarchy.get(userRole);
        Integer requiredLevel = roleHierarchy.get(requiredRole);
        
        return userLevel != null && requiredLevel != null && userLevel >= requiredLevel;
    }

    public boolean hasAnyRole(UserRole userRole, UserRole[] requiredRoles) {
        if (userRole == null || requiredRoles == null || requiredRoles.length == 0) {
            return false;
        }
        
        for (UserRole requiredRole : requiredRoles) {
            if (hasRole(userRole, requiredRole)) {
                return true;
            }
        }
        
        return false;
    }
}
