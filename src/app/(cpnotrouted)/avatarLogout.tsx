"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export function AvatarDropdown() {
  const { data: session } = useSession();
  const router = useRouter();

  // Define the async logout function
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const settingsRedirect = () => {
    switch (session?.user?.type) {
      case 'seller':
        router.push('/seller/settings');
        break;
      case 'client':
        router.push('/client/settings');
        break;
      case 'admin':
        router.push('/admin/settings');
        break;
      default:
        console.log('Unknown user type');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar>
            <AvatarImage src={session?.user?.avatarImage} alt="User Avatar" />
            <AvatarFallback>
              {session?.user?.firstName?.charAt(0)}
              {session?.user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={settingsRedirect}>Paramètres</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
