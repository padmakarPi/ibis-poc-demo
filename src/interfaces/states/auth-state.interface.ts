import { IPortal } from "./portal-state.interface";

export interface AuthState {
	authState: {
		isAuthenticated?: boolean;
		email: string;
		portals: any;
		userType: string;
		sid: string;
		name: string;
		expires_at: number;
		profile: IPortal[];
	};
}
