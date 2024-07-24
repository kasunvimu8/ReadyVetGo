import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { ChatParticipant } from "@/types/chat.ts";
import React, { useState } from "react";
import { getUserProfileByUserId } from "@/api/profile.ts";
import { Profile } from "@/types/profile.ts";
import Loading from "@/components/shared/Loading.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { dateToTimeDeltaString } from "@/lib/utils.ts";

const ProfileInfoCard: React.FC<ChatParticipant> = (participant) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

  const fetchUserAndProfile = async () => {
    try {
      setLoading(true);
      const responseProfile = await getUserProfileByUserId(participant.id);
      console.log(responseProfile);
      setProfile(responseProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const isOnline: boolean = !!(profile?.nbDevicesOnline && profile.nbDevicesOnline > 0);

  return (
    <HoverCard onOpenChange={(isOpen) => { if (isOpen) fetchUserAndProfile() }}>
      <HoverCardTrigger asChild>
        <Button variant="link">{participant.name}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 ml-4">
        <div className="flex justify-between space-x-4">
          <Avatar className="w-16 h-16">
            {(profile && profile.profileImageUrl) &&
                <AvatarImage src={`${fileUploadUrl}/${profile.profileImageUrl}`} />
            }
            <AvatarFallback>{participant.name[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{participant.name}</h4>
            {
              loading ? <Loading/> :
                error ? <p className="text-sm text-red-500">{error}</p> :
                  <p className="text-sm text-muted-foreground">{profile?.bio}</p>
            }
            <div className="flex items-center pt-2">
              {
                loading ? <Loading/> :
                  <div>
                    <Badge className={isOnline ? "bg-green-500" : "bg-red-500"}>
                      {isOnline ? "Online" : "Offline"}
                    </Badge>
                    {!isOnline && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Last seen {profile?.lastSeenOnline ?
                        dateToTimeDeltaString(new Date(profile.lastSeenOnline)) : 'unknown'}
                      </span>
                    )}
                  </div>
              }
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default ProfileInfoCard
