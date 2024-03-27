export const getStorageValue = (key: string) => {
	// getting stored value
	if (typeof window !== "undefined") {
		const saved = localStorage.getItem(key) || null;
		return saved ? JSON.parse(saved) : null;
	}
	return null;
};

export const setLocalStorage = (key: string, value: any) => {
	localStorage.setItem(key, value);
};

export const getToken = async () => {
	const tokenData = await getStorageValue("token");
	return tokenData.access_token;
};
