import * as Form from "@radix-ui/react-form";
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import ProfilePictureUpload from "./components/ProfilePictureUpload";

type ProfilePictureFormComponentProps = {
  profilePicture: string;
  handleInput: (event: any) => void;
  handlePatchProfilePicture: (base64Image: string | null) => void;
  userData: any;
};
const ProfilePictureFormComponent = ({
  profilePicture,
  handleInput,
  handlePatchProfilePicture,
  userData,
}: ProfilePictureFormComponentProps) => {

  const handleImageChange = (base64Image: string | null) => {
    handleInput({ target: { name: "profilePicture", value: base64Image || "" } });
  };

  return (
    <Form.Root
      onSubmit={(event) => {
        handlePatchProfilePicture(profilePicture || null);
        event.preventDefault();
      }}
    >
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload a custom image or use the default avatar with your initials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfilePictureUpload
            userName={userData?.username || userData?.email || "User"}
            currentImage={profilePicture || userData?.profile_image || null}
            onImageChange={handleImageChange}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </Form.Root>
  );
};
export default ProfilePictureFormComponent;
