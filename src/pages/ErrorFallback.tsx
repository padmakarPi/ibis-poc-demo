/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { FallbackProps } from "react-error-boundary";

const ErrorFallback = React.memo(
	({
		resetErrorBoundary,
		error,
		absolute,
	}: FallbackProps & { absolute?: boolean }) => (
		<></>
	),
);

ErrorFallback.displayName = "ErrorFallback";

export default ErrorFallback;
