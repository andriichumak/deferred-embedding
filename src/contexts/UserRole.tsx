import React from "react";

type UseRoleContextType = {
    role: "admin" | "viewer",
};

const UserRoleContext = React.createContext<UseRoleContextType>({role: "viewer"});

export const UserRoleProvider: React.FC<{role: UseRoleContextType["role"]}> = ({role, children}) =>
    <UserRoleContext.Provider value={{role}}>{children}</UserRoleContext.Provider>;
export const useUserRole = () => React.useContext(UserRoleContext);
