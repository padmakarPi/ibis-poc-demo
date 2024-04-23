import { ThemeProvider } from "@mui/material/styles";
import NavBar from "@/components/common/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { toogleTheme } from "@/redux/slices/themeslice";
import { darkTheme, lightTheme } from "@/styles/theme";
import { IRootState } from "@/interfaces/states/theme.interfaces";
import Dashboard from "@/components/Dashboard";

const Home = () => {
	const dispatch = useDispatch();
	const isDarkMode = useSelector((state: IRootState) => state.theme.isDarkMode);

	const currentTheme = isDarkMode ? darkTheme : lightTheme;
	const handleThemetoggle = () => {
		dispatch(toogleTheme());
	};
	return (
		<>
			<ThemeProvider theme={currentTheme}>
				<NavBar
					isDarkMode={isDarkMode}
					toggleTheme={handleThemetoggle}
					currentTheme={currentTheme}
					data-testid="navbar"
				/>
				<Dashboard data-testid="dashboard" />
			</ThemeProvider>
		</>
	);
};

export default Home;
