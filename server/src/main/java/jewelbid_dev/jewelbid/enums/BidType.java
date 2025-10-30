package jewelbid_dev.jewelbid.enums;

public enum BidType {
    MANUAL("Manual Bidding"),
    AUTOMATIC("Automatic Bidding");

    private final String displayName;

    BidType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
