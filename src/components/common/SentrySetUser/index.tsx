import { useEffect } from "react";
import { useSelector } from "react-redux";
import * as Sentry from "@sentry/nextjs";
import { RootState } from "@/redux/store";
import { AuthState } from "@/interfaces/states/auth-state.interface";

export default function SentrySetUser() {
	const authState: AuthState = useSelector((state: RootState) => state.auth);
	useEffect(() => {
		if (authState && authState.authState) {
			Sentry.setUser({
				id: authState.authState.user_id,
				email: authState.authState.email,
				username: authState.authState.name,
			});
		} else {
			Sentry.setUser(null);
		}
	}, [authState]);

	return null;
}
