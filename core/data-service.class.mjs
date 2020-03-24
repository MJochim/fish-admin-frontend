export {DataService};

class DataService {
    constructor () {
        this.apiUrl = "https://api.example.com/questionnaire-data";
        this.bearerToken = "";

        this.keycloak = Keycloak({
            url: "https://keycloak.example.com/auth/",
            realm: "master",
            clientId: "fish-frontend",
	});
    }

    async initialize () {
	await this.keycloak.init({
		onLoad: "login-required",
		promiseType: "native",
	});
    }

    async refreshBearerToken() {
        await this.keycloak.updateToken(5);
        this.bearerToken = this.keycloak.token;
    }

    amIUser() {
        try {
            // The resource_access isn't always present, which is why we catch excptions.
            // In these cases, access is denied.
            if (this.keycloak.tokenParsed.resource_access[this.keycloak.clientId].roles.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    amIAdmin() {
        if (this.keycloak.tokenParsed.resource_access[this.keycloak.clientId].roles.includes("all")) {
            return true;
        } else {
            return false;
        }
    }

    async getPassword() {
        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/password",
	    {headers: {"Authorization": "Bearer " + this.bearerToken}}
        );

        if (response.status === 403) {
            return undefined;
        }

        return await response.json();
    }

    async getQuestionnaireNames() {
        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires",
	    {headers: {"Authorization": "Bearer " + this.bearerToken}}
        );

        return await response.json();
    }

    async createQuestionnaire(questionnaireName) {
        const form = new FormData();
        form.set("questionnaireName", questionnaireName);

        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires",
	    {
                headers: {"Authorization": "Bearer " + this.bearerToken},
                method: "POST",
                body: form
            }
        );

        return await response.json();
    }

    async getQuestionnaireResponses(questionnaireName) {
        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires/" + encodeURIComponent(questionnaireName) + "/responses",
	    {headers: {"Authorization": "Bearer " + this.bearerToken}}
        );

        return await response.json();
    }

    async getQuestionnaireLabels(questionnaireName) {
        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires/" + encodeURIComponent(questionnaireName) + "/labels",
	    {headers: {"Authorization": "Bearer " + this.bearerToken}}
        );

        return await response.json();
    }

    async updateQuestionnaireLabels(questionnaireName, labels) {
        const form = new FormData();
        for (const label of labels) {
            form.set(label[0], label[1]);
        }

        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires/" + encodeURIComponent(questionnaireName) + "/labels",
	    {
                method: "PATCH",
                headers: {"Authorization": "Bearer " + this.bearerToken},
                body: form
            }
        );

        return await response.json();
    }

    async getQuestionnaireEmails(questionnaireName) {
        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires/" + encodeURIComponent(questionnaireName) + "/emails",
	    {headers: {"Authorization": "Bearer " + this.bearerToken}}
        );

        const emailsObject = await response.json();
        
        const result = new Map();
        for (const key in emailsObject) {
            result.set(key, emailsObject[key]);
        }
        
        return result;
    }

    async updateQuestionnaireEmail(questionnaireName, language, email) {
        const form = new FormData();
        form.set("language", email.language);
        form.set("subject", email.subject);
        form.set("senderAddress", email.senderAddress);
        form.set("ccRecipient", email.ccRecipient);
        form.set("text", email.text);

        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires/" + encodeURIComponent(questionnaireName) + "/emails/" + encodeURIComponent(language),
	    {
                method: "PATCH",
                headers: {"Authorization": "Bearer " + this.bearerToken},
                body: form
            }
        );

        return await response.json();
    }

    async deleteQuestionnaireEmail(questionnaireName, language) {
        await this.refreshBearerToken();

        const response = await fetch (
            this.apiUrl + "/questionnaires/" + encodeURIComponent(questionnaireName) + "/emails/" + encodeURIComponent(language),
	    {
                method: "DELETE",
                headers: {"Authorization": "Bearer " + this.bearerToken}
            }
        );

        return await response.json();
    }
}
