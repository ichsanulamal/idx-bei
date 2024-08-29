export const fetchData = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                ...options.headers,
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include",
            ...options,
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
