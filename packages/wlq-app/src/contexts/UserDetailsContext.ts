import { UserDetails } from "@wlq/wlq-core/lib/model";
import { createContext } from "react";

const UserDetailsContext = createContext<UserDetails | null>(null);
export default UserDetailsContext;
