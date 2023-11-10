"use client";

import { useParams } from "next/navigation";

export default function EditPost() {
	const { id } = useParams();

	return (
		<div>
			<h1>edit Post {id}</h1>
		</div>
	);
}
