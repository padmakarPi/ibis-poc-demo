"use client";

import { useEffect, useState } from "react";
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@mui/material";
import { withPrivateRoute } from "@/components/common/HOC";
import { getVesselList } from "@/services/vessel.service";
import { IVesselListResponse } from "@/interfaces";

function Home() {
	const [data, setData] = useState<IVesselListResponse[]>([]);

	const fetchData = async () => {
		// this code is only for demo purpose
		const response = await getVesselList({
			PageNumber: 1,
			PageSize: 10,
			SearchText: "",
		});
		if (
			response &&
			response.data &&
			response.data.result &&
			response.data.result.recordset
		) {
			setData(response.data.result.recordset);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<main>
			<div style={{ height: "100vh", backgroundColor: "white" }}>
				<div>
					<h2>Welcome to FrontEnd Template</h2>
					{data ? (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>VesselId</TableCell>
										<TableCell>VesselName</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data.map((el, index) => (
										<TableRow key={index}>
											<TableCell>{el.VesselId}</TableCell>
											<TableCell>{el.VesselName}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					) : null}
				</div>
			</div>
		</main>
	);
}

export default withPrivateRoute(Home);
