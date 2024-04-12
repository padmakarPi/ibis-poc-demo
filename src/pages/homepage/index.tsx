import withPermissions from "@/components/hoc/withPermissions";
import AuthService from "@/services/auth.service";

function Page() {
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

export default withPermissions(Page);
