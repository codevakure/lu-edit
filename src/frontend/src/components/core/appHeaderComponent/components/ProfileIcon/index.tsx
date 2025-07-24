import { useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import Avatar from "@/components/ui/avatar";

export function ProfileIcon() {
  const { userData } = useContext(AuthContext);

  // Use base64 profile image if available, otherwise show initials
  const profileImage = userData?.profile_image?.startsWith('data:') 
    ? userData.profile_image 
    : null;

  const userName = userData?.username || "User";

  return (
    <Avatar
      name={userName}
      src={profileImage}
      size={24}
      className="shrink-0 focus-visible:outline-0"
    />
  );
}
