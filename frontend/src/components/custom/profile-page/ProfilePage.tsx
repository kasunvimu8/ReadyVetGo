import { getUserProfile } from "@/api/profile"
import PageTitle from "@/components/shared/PageTitle"
import { Profile } from "@/types/profile"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useForm, Controller } from "react-hook-form"
import { updateUserProfile } from "@/api/profile"
import { deleteFile, uploadFile } from "@/api/file-upload"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store.ts"
import { Role } from "@/types/user.ts"
import Loading from "@/components/shared/Loading.tsx"
import ProfileDocuments from "@/components/custom/profile-page/ProfileDocumentsDialog"
import { setCurrentProfile } from "@/reducers/authenticationReducer.ts"

const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, profile } = useSelector(
    (state: RootState) => state.authentication
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null)

  const methods = useForm<Partial<Profile>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
    },
  })

  const { handleSubmit, control } = methods

  useEffect(() => {
    if (!user) {
      setIsLoading(true)
      return
    }

    const fetchUserAndProfile = async () => {
      try {
        setIsLoading(true)
        const responseProfile = await getUserProfile()
        setCurrentProfile(responseProfile)
        methods.reset({
          firstName: responseProfile.firstName,
          lastName: responseProfile.lastName,
          bio: responseProfile.bio,
          profileImageUrl: responseProfile.profileImageUrl,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }
    void fetchUserAndProfile()
  }, [user, methods])

  const onSubmit = async (data: Partial<Profile>) => {
    try {
      delete data.profileImageUrl // Handled in another function separately
      if (!profile) return
      const updatedProfile = await updateUserProfile(data)
      dispatch(setCurrentProfile(updatedProfile))
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile.")
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setCurrentImageFile(file)
      } catch (err) {
        console.error("Error uploading file:", err)
        setError("Failed to upload profile picture.")
      }
    }
  }

  const onSubmitImage = async () => {
    try {
      if (!profile || !currentImageFile) return

      // Check if previous image
      if (profile.profileImageUrl) {
        void deleteFile(profile.profileImageUrl).catch((err) =>
          console.error(err)
        )
      }
      // 1. Upload the file
      const uploadedFile = await uploadFile(currentImageFile, true)

      // 2. Update the profile with the new profile picture
      const updatedProfile = await updateUserProfile({
        profileImageUrl: uploadedFile.fileUrl,
      })

      // 3. Update the state with the updated profile and display the new profile picture
      dispatch(setCurrentProfile(updatedProfile))
      // 4. Reset the current image file
      setCurrentImageFile(null)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile.")
    }
  }

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loading className="text-4xl" />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <PageTitle title="Profile" />
      </div>
      <div className="mb-4">
        <Avatar className="h-32 w-32">
          <AvatarImage
            className="object-cover"
            src={
              profile?.profileImageUrl
                ? `${fileUploadUrl}/${profile?.profileImageUrl}`
                : "/no-image.jpg"
            }
          />
        </Avatar>
      </div>
      <div className="text-3xl font-semibold text-gray-800">
        {profile?.firstName} {profile?.lastName}
      </div>
      <div>
        <div className="font-semibold pt-2 pb-2 text-lg">Bio:</div>
        <div>{profile?.bio}</div>
      </div>
      {user?.role === Role.Vet && (
        <div className="pt-4">
          Your documents:
          <ProfileDocuments {...user} />
        </div>
      )}
      <div className="font-semibold pt-2 pb-2 text-lg">Email: </div>{" "}
      <div> {profile?.email} </div>
      <div className="font-semibold pt-2 pb-2 text-lg">
        {" "}
        Email Verification Status:{" "}
      </div>{" "}
      <div> {user?.isEmailVerified ? "Verified" : "Not verified"} </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="firstName" className="col-span-3" />
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="lastName" className="col-span-3" />
                )}
              />
            </div>
            <DialogDescription>
              You can tell more about yourself here {""}
              {user?.role === Role.Vet
                ? "such as your experience, qualifications, etc."
                : "such as your farm size, location, etc."}
            </DialogDescription>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="bio" className="col-span-3" />
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="m-4">
            Upload Profile Picture
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload profile picture</DialogTitle>
            <DialogDescription>
              Upload your profile picture here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={onSubmitImage}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage
