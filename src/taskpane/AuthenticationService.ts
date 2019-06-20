/*
const authenticationService = {
    async getToken(): Promise<string | undefined> {
        const response = await fetch("/token", {mode: 'cors'});
        const json = await response.json();
        return json.accessToken;
    }
};
*/
const authenticationService = {
    async getToken(): Promise<string | undefined> {
        let responsePromise = fetch("/token")
        return responsePromise.then(async (response: Response) => {
            const json = await response.json();
            return json.accessToken;
        }).catch(async (error) => {
            console.log(JSON.stringify(error))
            return undefined;
        });
    }
};

export { authenticationService as AuthenticationService };
