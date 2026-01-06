const PUBLIC_USER_FIELDS = [
    'id', // Required for profile linking
    'fullname',
    'profileImage',
    'positiveRatings',
    'negativeRatings',
];

const PUBLIC_PRODUCT_FIELDS = [
    'id',
    'name',
    'description',
    // Filter option relations (new UUID-based fields)
    'brandOption',
    'materialOption',
    'targetAudienceOption',
    'eraOption',
    'finenessOption',
    'conditionOption',
    // Other product fields
    'totalWeight',
    'size',
    'mainStoneCaratWeight',
    'surroundingStonesCaratWeight',
    'origin',
    'startingPrice',
    'currentPrice',
    'stepPrice',
    'buyNowPrice',
    'endDate',
    'autoRenewal',
    'status',
    'bidCount',
    'mainImage',
    'additionalImages',
    'allowNewBidders',
    'watchlistCount',
    'seller',
    'currentBidder',
    'category',
    'created_at', // Required for NEW badge
];

const PUBLIC_CATEGORY_FIELDS = ['id', 'name', 'slug', 'description'];

const PUBLIC_FILTER_FIELDS = ['name', 'slug'];

export function sanitizeUser<T extends Record<string, any>>(
    user: T | null | undefined,
): Record<string, any> | null {
    if (!user) return null;

    const sanitized: Record<string, any> = {};
    for (const field of PUBLIC_USER_FIELDS) {
        if (user[field] !== undefined) {
            sanitized[field] = user[field];
        }
    }
    return sanitized;
}

export function sanitizeUserMinimal<T extends Record<string, any>>(
    user: T | null | undefined,
): Record<string, any> | null {
    if (!user) return null;

    return {
        id: user.id,
        fullname: user.fullname,
        profileImage: user.profileImage,
        positiveRatings: user.positiveRatings,
        negativeRatings: user.negativeRatings,
    };
}

export function sanitizeCategory<T extends Record<string, any>>(
    category: T | null | undefined,
): Record<string, any> | null {
    if (!category) return null;

    const sanitized: Record<string, any> = {};
    for (const field of PUBLIC_CATEGORY_FIELDS) {
        if (category[field] !== undefined) {
            sanitized[field] = category[field];
        }
    }
    return sanitized;
}

export function sanitizeCategories<T extends Record<string, any>>(
    categories: T[],
): Record<string, any>[] {
    return categories
        .map((category) => sanitizeCategory(category))
        .filter(Boolean);
}

export function sanitizeFilter<T extends Record<string, any>>(
    filter: T | null | undefined,
): Record<string, any> | null {
    if (!filter) return null;

    const sanitized: Record<string, any> = {};
    for (const field of PUBLIC_FILTER_FIELDS) {
        if (filter[field] !== undefined) {
            sanitized[field] = filter[field];
        }
    }
    return sanitized;
}

export function sanitizeFilters<T extends Record<string, any>>(
    filters: T[],
): Record<string, any>[] {
    return filters.map((filter) => sanitizeFilter(filter)).filter(Boolean);
}

export function sanitizeProduct<T extends Record<string, any>>(
    product: T | null | undefined,
): Record<string, any> | null {
    if (!product) return null;

    const sanitized: Record<string, any> = {};
    for (const field of PUBLIC_PRODUCT_FIELDS) {
        if (product[field] !== undefined) {
            sanitized[field] = product[field];
        }
    }

    // Sanitize nested user relations
    if (sanitized.seller) {
        sanitized.seller = sanitizeUser(sanitized.seller);
    }
    if (sanitized.currentBidder) {
        sanitized.currentBidder = sanitizeUser(sanitized.currentBidder);
    }
    // Sanitize category
    if (sanitized.category) {
        sanitized.category = sanitizeCategory(sanitized.category);
    }
    // Sanitize filter option relations
    if (sanitized.brandOption) {
        sanitized.brandOption = sanitizeFilter(sanitized.brandOption);
    }
    if (sanitized.materialOption) {
        sanitized.materialOption = sanitizeFilter(sanitized.materialOption);
    }
    if (sanitized.targetAudienceOption) {
        sanitized.targetAudienceOption = sanitizeFilter(
            sanitized.targetAudienceOption,
        );
    }
    if (sanitized.eraOption) {
        sanitized.eraOption = sanitizeFilter(sanitized.eraOption);
    }
    if (sanitized.finenessOption) {
        sanitized.finenessOption = sanitizeFilter(sanitized.finenessOption);
    }
    if (sanitized.conditionOption) {
        sanitized.conditionOption = sanitizeFilter(sanitized.conditionOption);
    }

    return sanitized;
}

export function sanitizeProducts<T extends Record<string, any>>(
    products: T[],
): Record<string, any>[] {
    return products.map((product) => sanitizeProduct(product)).filter(Boolean);
}

export function sanitizeEntitiesWithUsers<T extends Record<string, any>>(
    entities: T[],
    userFields: string[] = [
        'seller',
        'bidder',
        'buyer',
        'fromUser',
        'toUser',
        'asker',
        'currentBidder',
        'sender',
    ],
): T[] {
    return entities.map((entity) =>
        sanitizeEntityWithUsers(entity, userFields),
    );
}

export function sanitizeEntityWithUsers<T extends Record<string, any>>(
    entity: T | null | undefined,
    userFields: string[] = [
        'seller',
        'bidder',
        'buyer',
        'fromUser',
        'toUser',
        'asker',
        'currentBidder',
        'sender',
    ],
): T {
    if (!entity) return entity;

    const sanitized = { ...entity } as Record<string, any>;
    for (const field of userFields) {
        if (sanitized[field]) {
            sanitized[field] = sanitizeUser(sanitized[field]);
        }
    }
    return sanitized as T;
}
