package jewelbid_dev.jewelbid.enums;

/**
 * Enum định nghĩa trạng thái đơn hàng sau đấu giá
 */
public enum OrderStatus {
    PENDING_PAYMENT("Pending Payment"),
    PAID("Paid"),
    SHIPPED("Shipped"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
