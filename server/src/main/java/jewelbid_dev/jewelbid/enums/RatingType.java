package jewelbid_dev.jewelbid.enums;

/**
 * Enum định nghĩa loại đánh giá người dùng
 */
public enum RatingType {
    POSITIVE("Positive", 1),
    NEGATIVE("Negative", -1);

    private final String displayName;
    private final int value;

    RatingType(String displayName, int value) {
        this.displayName = displayName;
        this.value = value;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getValue() {
        return value;
    }
}
