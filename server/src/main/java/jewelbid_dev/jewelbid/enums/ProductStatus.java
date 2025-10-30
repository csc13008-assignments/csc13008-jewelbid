package jewelbid_dev.jewelbid.enums;

/**
 * Enum định nghĩa trạng thái của sản phẩm đấu giá
 */
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
