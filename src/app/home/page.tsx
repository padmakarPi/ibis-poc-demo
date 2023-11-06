"use client";

import { withPrivateRoute } from "@/components/common/HOC";

function Home1() {
	return (
		<main>
			<div style={{ height: "100vh", backgroundColor: "white" }}>
				<div>
					<h2>Welcome to FrontEnd Template</h2>
				</div>
			</div>
		</main>
	);
}

export default withPrivateRoute(Home1);
