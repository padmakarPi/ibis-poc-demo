import AuthService from "@/services/auth.service";

export default function Page() {
	const authService = new AuthService();

	const logout = async () => {
		await authService.logout();
	};

	return (
		<>
			<h1>Home page</h1>
			<button onClick={logout}>Logout</button>
		</>
	);
}
