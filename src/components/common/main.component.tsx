"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { persistor, store } from "@/redux/store.redux";
import { lightTheme, darkTheme } from "@/styles/MUI/theme";
import ThemeToggler from "@/components/common/theme.update.component";

export default function Main(props: any) {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	return (
		<div>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
						<CssBaseline />
						<ThemeToggler
							isDarkMode={isDarkMode}
							setIsDarkMode={setIsDarkMode}
						/>
						<Head>
							<meta
								name="viewport"
								content="width=device-width, initial-scale=1.0"
							/>
							<link rel="icon" href="/favicon.svg" sizes="any" />
						</Head>
						{props.children}
					</ThemeProvider>
				</PersistGate>
			</Provider>
		</div>
	);
}
