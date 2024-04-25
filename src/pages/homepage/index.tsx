import { AuthContext } from "@/authcontext/AuthContext";
import { useContext } from "react";

export default function Home() {
	const { logout } = useContext(AuthContext);

	const handleLogout = () => {
		logout();
	};

	return (
		<>
			<h1>Home page</h1>
			<button onClick={handleLogout}>Logout</button>
		</>
	);
}
