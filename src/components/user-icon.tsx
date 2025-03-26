"use client";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const UserProfile = () => {
  const { data } = useSession();


  if (!data) {
    return (
      <div>
        {" "}
        <User className="w-8 h-8 text-neutral-500 hover:text-neutral-300 cursor-pointer hover:scale-110 transition-transform duration-200" />
      </div>
    );
  }


  return (
    <Avatar className="w-8 h-8 bg-zinc-800/50 rounded-full">
      <AvatarImage
        src={data?.user.image || "https://github.com/shadcn.png"}
        alt="User Profile"
        className="w-8 h-8 rounded-full"
      />
      <AvatarFallback>
        <User className="w-8 h-8 text-neutral-500 hover:text-neutral-300 cursor-pointer hover:scale-110 transition-transform duration-200" />
      </AvatarFallback>
    </Avatar>
  );
};
