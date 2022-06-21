import { User } from "api";
import * as React from "react";

const ProfileUserContext = React.createContext<User>({} as User);
ProfileUserContext.displayName = "ProfileUserContext";

interface ProfileUserProviderProps {
  children?: React.ReactNode;
  user: User;
}

export function ProfileUserProvider({
  children,
  user,
}: ProfileUserProviderProps) {
  return (
    <ProfileUserContext.Provider value={user}>
      {children}
    </ProfileUserContext.Provider>
  );
}

export function useProfileUser() {
  const profileUser = React.useContext(ProfileUserContext);
  if (profileUser === null) {
    throw new Error("No ProfileUserContext provided!");
  }
  return profileUser;
}
