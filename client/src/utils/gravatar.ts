import md5 from "crypto-js/md5";

const GRAVATAR_BASE_URL = "https://www.gravatar.com/avatar/";
const DEFAULT_IMAGE = "mp"; // Mystery person (generic avatar)

/**
 * Generate Gravatar URL from email
 */
export function getGravatarUrl(email: string | undefined, size: number = 80): string {
    if (!email) {
        return `${GRAVATAR_BASE_URL}?d=${DEFAULT_IMAGE}&s=${size}`;
    }

    const emailHash = md5(email.toLowerCase().trim()).toString();
    return `${GRAVATAR_BASE_URL}${emailHash}?d=${DEFAULT_IMAGE}&s=${size}`;
}
