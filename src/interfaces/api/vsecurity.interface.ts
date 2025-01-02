export interface IGetApplicationListByUser {
	ClientId: string;
	IconURL: string;
	Id: number;
	IsSSODisabled: boolean;
	Name: string;
	NavigationURL: string;
	PortalLogoUrl: string;
}

export interface IGetAllApplicationListByUser {
	ClientId: string;
	IconURL: string;
	Id: number;
	IsSSODisabled: boolean;
	Name: string;
	NavigationURL: string;
	PortalLogoUrl: string;
	IsEnable: boolean;
	Environment: string;
}

export interface ISetUserProfile {
	DarkMode?: boolean;
	Language?: string;
}
