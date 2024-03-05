import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Home from "@/app/(dashboard)/dashboard/page";
import { lightTheme } from "@/styles/theme";
import { beforeEach } from "node:test";

jest.mock("react-redux", () => ({
	...jest.requireActual("react-redux"),
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}));

describe("Home component", () => {
	beforeEach(() => {
		(useDispatch as jest.Mock).mockClear();
		(useSelector as jest.Mock).mockClear();
	});

	it("light mode by default", async () => {
		render(
			<ThemeProvider theme={lightTheme}>
				<Home />
			</ThemeProvider>,
		);
		const navBar = await screen.findByTestId("navbar");
		expect(navBar).toBeInTheDocument();
		const dashboard = await screen.findByTestId("dashboard");
		expect(dashboard).toBeInTheDocument();
		expect(navBar).toHaveStyle("background-color:#052e2b");
	});
});
