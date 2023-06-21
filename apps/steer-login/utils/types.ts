export type Config = {
    checkout_url: string;
    customer_portal_url: string;
}

export type User = {
    email: string;
    firebase_auth_uid: string;
    tier: 'free' | 'premium';
    uid: string;
    stripe: null | {
        subscribed_until: string
    };
}