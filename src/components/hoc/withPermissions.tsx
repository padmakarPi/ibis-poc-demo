import { checkApplicationAccess } from "@/services/security.service";
import { useEffect, useState } from "react";

const withPermissions = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
) => {
	const ApplicationAccessComponent: React.FC<P> = props => {
		const [hasApplicationAccess, setHasApplicationAccess] =
			useState<boolean>(false);

		useEffect(() => {
			const fetchApplicationAccess = async () => {
				const clientId: string = process.env.NEXT_PUBLIC_CLIENT_ID || "";
				const response = await checkApplicationAccess(clientId);
				setHasApplicationAccess(Boolean(response.data.result || false));
				if (!response.data.result) {
					window.location.href = `${process.env.NEXT_PUBLIC_STS_AUTHORITY}/Account/AccessDenied`;
				}
			};

			fetchApplicationAccess();
		}, []);

		return hasApplicationAccess && <WrappedComponent {...props} />;
	};

	return ApplicationAccessComponent;
};

export default withPermissions;
