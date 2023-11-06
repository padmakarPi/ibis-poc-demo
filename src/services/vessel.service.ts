import { AxiosResponse } from "axios";
import { vesselServiceAxios } from "@/lib/axios/base-urls";
import {
	GenericResponse,
	IVesselListParams,
	IVesselListResponse,
} from "@/interfaces";

export const getVesselList = (
	params: IVesselListParams,
): Promise<AxiosResponse<GenericResponse<IVesselListResponse>>> => {
	const url = "/all-vessels";
	return vesselServiceAxios.get(url, { params });
};
