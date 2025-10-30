package jewelbid_dev.jewelbid.enums;

/**
 * Enum định nghĩa trạng thái của người dùng
 */
public enum UserStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    PENDING_VERIFICATION("Pending Verification");

    private final String displayName;

    UserStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
