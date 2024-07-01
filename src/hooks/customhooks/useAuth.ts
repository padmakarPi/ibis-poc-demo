import { AuthContext } from "@/authcontext/AuthContext";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext);
