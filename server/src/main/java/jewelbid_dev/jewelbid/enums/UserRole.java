package jewelbid_dev.jewelbid.enums;

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
