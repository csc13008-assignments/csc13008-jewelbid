const PUBLIC_USER_FIELDS = [
    'fullname',
    'profileImage',
    'positiveRatings',
    'negativeRatings',
];

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
