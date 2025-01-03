import React from "react";
import { FallbackProps } from "react-error-boundary";
import { VErrorFallBack } from "@vplatform/shared-components";

const ErrorFallback = React.memo(
	({
		resetErrorBoundary,
		error,
		absolute,
	}: FallbackProps & { absolute?: boolean }) => (
		<VErrorFallBack
			resetErrorBoundary={resetErrorBoundary}
			error={error}
			absolute={absolute}
		/>
	),
);

ErrorFallback.displayName = "ErrorFallback";

export default ErrorFallback;
