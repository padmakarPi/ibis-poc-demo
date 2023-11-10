"use client";

import { useParams } from "next/navigation";

export default function GetPostById() {
	const { id } = useParams();

	return (
		<div>
			<h1>View Post for {id}</h1>
		</div>
	);
}
