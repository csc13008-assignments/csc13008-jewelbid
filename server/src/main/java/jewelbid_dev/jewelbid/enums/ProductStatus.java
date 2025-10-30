package jewelbid_dev.jewelbid.enums;

public enum ProductStatus {
    DRAFT("Draft"),
    ACTIVE("Active"),
    ENDED("Ended"),
    CANCELLED("Cancelled");

    private final String displayName;

    ProductStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
