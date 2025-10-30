package jewelbid_dev.jewelbid.enums;

/**
 * Enum định nghĩa các vai trò của người dùng trong hệ thống
 */
public enum UserRole {
    GUEST("Guest"),
    BIDDER("Bidder"), 
    SELLER("Seller"),
    ADMIN("Administrator");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
