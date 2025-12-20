import { Avatar } from "@mui/material";
import { getGravatarUrl } from "../../utils/gravatar";

interface UserAvatarProps {
    name: string;
    email?: string;
    size?: number;
}

/**
 * User avatar component using Gravatar
 */
export function UserAvatar({ name, email, size = 40 }: UserAvatarProps) {
    const avatarUrl = getGravatarUrl(email, size * 2);

    return (
        <Avatar
            src={avatarUrl}
            alt={name || "User"}
            sx={{ width: size, height: size }}
        >
            {name ? name.charAt(0).toUpperCase() : "?"}
        </Avatar>
    );
}
