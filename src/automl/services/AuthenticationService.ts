
const authenticationService = {
    async getToken(): Promise<string | undefined> {
        const response = await fetch("http://localhost:3001");
        const json = await response.json();
        return json.accessToken;
    }
};

export { authenticationService as AuthenticationService };
