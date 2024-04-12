import { securityServiceAxios } from "@/lib/axios/base-urls";
import { AxiosResponse } from "axios";

export const checkApplicationAccess = (
	ClientId: string,
): Promise<AxiosResponse<any>> => {
	const url = `/v1/OmniUsers/checkapplication-accessbyuser?clientId=${ClientId}`;
	return securityServiceAxios.get(url);
};
