export {EmailView};

const htmlTemplate = `
    <style>
        #button-area {
            display: flex;
            flex-direction: row;
        }

        button {
            margin: 0 10px;
        }
        button:first-child {
            margin-left: 0;
        }
        button:last-child {
            margin-right: 0;
        }

        .form-area input,
        .form-area textarea {
            width: 100%;
            box-sizing: border-box;
        }

        .form-group textarea {
            height: 200px;
        }

        #editor-form.hidden {
            display: none;
        }
    </style>

    <div class="form-group form-inline">
        <label class="control-label" for="email-selector">Select confirmation email:</label>
        <br>
        <select class="form-control" id="email-selector"></select>
        <button id="btn-add-email" class="btn btn-primary">Add new email</button>
    </div>

    <hr>

    <div id="editor-form" class="hidden">
        <div class="form-group" id="form-group-language">
            <label class="control-label" for="input-language">Language:</label>
            <input class="form-control" id="input-language">
        </div>

        <div class="form-group" id="form-group-subject">
            <label class="control-label" for="input-subject">Subject:</label>
            <input class="form-control" id="input-subject">
        </div>

        <div class="form-group" id="form-group-sender-address">
            <label class="control-label" for="input-sender-address">Sender address</label>
            <select class="form-control" id="input-sender-address">
                <option>noreply@example.com</option>
            </select>
        </div>

        <div class="form-group" id="form-group-cc-recipient">
            <label class="control-label" for="input-cc-recipient">CC recipient</label>
            <input class="form-control" id="input-cc-recipient">
        </div>

        <div class="form-group" id="form-group-text">
            <label class="control-label" for="input-text">Text</label>
            <textarea class="form-control" id="input-text"></textarea>
        </div>

        <div class="form-group" id="button-area">
            <button class="btn btn-primary" id="btn-submit">Save</button>
            <button class="btn btn-default" id="btn-reset">Reset</button>
            
            <span style="flex-grow: 1;"></span>

            <input type="checkbox" id="delete-checkbox">
            <button class="btn btn-danger" disabled="disabled" id="btn-delete">Delete</button>
        </div>

        <div id="change-notification" class="form-group has-warning" style="display: none">
            <label class="control-label">Changed fields are highlighted in yellow.</label>
        </div>
    </div>
`;


const newLanguage = "new-language";

const emailTemplate = {
    subject: "",
    senderAddress: "noreply@example.com",
    ccRecipient: "",
    text: ""
};


class EmailView {
    constructor (container, dataService, questionnaireName) {
        this.container = container;
        this.dataService = dataService;
        this.questionnaireName = questionnaireName;

        this.emails = new Map();
        this.savedValues = null;

        this.update();
    }

    async update() {
        this.container.innerHTML = "";
        this.emails = await this.dataService.getQuestionnaireEmails(this.questionnaireName);
        this.container.innerHTML = htmlTemplate;

        this.container.querySelector("#btn-add-email").addEventListener("click", this.addEmail.bind(this));
        this.container.querySelector("#btn-reset").addEventListener("click", this.resetChanges.bind(this));
        this.container.querySelector("#btn-submit").addEventListener("click", this.submitChanges.bind(this));

        if (this.emails.has(newLanguage)) {
            this.disableAddEmailButton();
        }

        this.container.querySelector("#input-language").addEventListener("input", this.visualiseUnsavedChanges.bind(this));
        this.container.querySelector("#input-subject").addEventListener("input", this.visualiseUnsavedChanges.bind(this));
        this.container.querySelector("#input-sender-address").addEventListener("input", this.visualiseUnsavedChanges.bind(this));
        this.container.querySelector("#input-cc-recipient").addEventListener("input", this.visualiseUnsavedChanges.bind(this));
        this.container.querySelector("#input-text").addEventListener("input", this.visualiseUnsavedChanges.bind(this));

        this.container.querySelector("#delete-checkbox").addEventListener("change", (event) => {
            this.container.querySelector("#btn-delete").disabled = !event.target.checked;
        });

        this.container.querySelector("#btn-delete").addEventListener("click", async (event) => {
            const language = this.container.querySelector("#email-selector").value;
            await this.dataService.deleteQuestionnaireEmail(this.questionnaireName, language);
            this.update();
        });

        const emailSelector = this.container.querySelector("#email-selector");
        emailSelector.addEventListener("change", this.handleEmailSelectorChange.bind(this));

        for (const email of this.emails) {
            const option = document.createElement("option");
            option.innerText = email[0];
            
            emailSelector.appendChild(option);
        }

        await this.selectEmail(emailSelector.value);
    }

    handleEmailSelectorChange (event) {
        if (this.checkForUnsavedChanges()) {
            alert("Save or reset your changes first");
            event.target.value = this.savedValues.language;
        } else {
            this.selectEmail(event.target.value);
        }
    }

    checkForUnsavedChanges () {
        if (this.savedValues === null) {
            return false;
        }

        if (
            this.container.querySelector("#input-language").value != this.savedValues.language
            ||
            this.container.querySelector("#input-subject").value != this.savedValues.subject
            ||
            this.container.querySelector("#input-sender-address").value != this.savedValues.senderAddress
            ||
            this.container.querySelector("#input-cc-recipient").value != this.savedValues.ccRecipient
            ||
            this.container.querySelector("#input-text").value != this.savedValues.text
        ) {
            return true;
        } else {
            return false;
        }
    }

    visualiseUnsavedChanges () {
        if (this.savedValues === null) {
            return false;
        }

        let changeDetected = false;

        if (this.container.querySelector("#input-language").value != this.savedValues.language) {
            this.container.querySelector("#form-group-language").classList.add("has-warning");
            changeDetected = true;
        } else {
            this.container.querySelector("#form-group-language").classList.remove("has-warning");
        }

        if (
            this.emails.has(this.container.querySelector("#input-language").value)
            &&
            this.container.querySelector("#input-language").value != this.savedValues.language
        ) {
            this.container.querySelector("#form-group-language").classList.add("has-error");
        } else {
            this.container.querySelector("#form-group-language").classList.remove("has-error");
        }

        if (this.container.querySelector("#input-subject").value != this.savedValues.subject) {
            this.container.querySelector("#form-group-subject").classList.add("has-warning");
            changeDetected = true;
        } else {
            this.container.querySelector("#form-group-subject").classList.remove("has-warning");
        }

        if (this.container.querySelector("#input-sender-address").value != this.savedValues.senderAddress) {
            this.container.querySelector("#form-group-sender-address").classList.add("has-warning");
            changeDetected = true;
        } else {
            this.container.querySelector("#form-group-sender-address").classList.remove("has-warning");
        }

        if (this.container.querySelector("#input-cc-recipient").value != this.savedValues.ccRecipient) {
            this.container.querySelector("#form-group-cc-recipient").classList.add("has-warning");
            changeDetected = true;
        } else {
            this.container.querySelector("#form-group-cc-recipient").classList.remove("has-warning");
        }

        if (this.container.querySelector("#input-text").value != this.savedValues.text) {
            this.container.querySelector("#form-group-text").classList.add("has-warning");
            changeDetected = true;
        } else {
            this.container.querySelector("#form-group-text").classList.remove("has-warning");
        }

        if (changeDetected) {
            this.container.querySelector("#change-notification").style.display = "block";
        } else {
            this.container.querySelector("#change-notification").style.display = "none";
        }
    }

    async selectEmail (language) {
        const email = this.emails.get(language);
        if (!email) {
            return;
        }

        this.container.querySelector("#email-selector").value = language;

        this.container.querySelector("#editor-form").classList.remove("hidden");

        this.savedValues = {
            language: language,
            senderAddress: email.senderAddress,
            ccRecipient: email.ccRecipient,
            subject: email.subject,
            text: email.text
        };

        this.container.querySelector("#input-language").value = this.savedValues.language;
        this.container.querySelector("#input-subject").value = this.savedValues.subject;
        this.container.querySelector("#input-sender-address").value = this.savedValues.senderAddress;
        this.container.querySelector("#input-cc-recipient").value = this.savedValues.ccRecipient;
        this.container.querySelector("#input-text").value = this.savedValues.text;
    };

    disableAddEmailButton () {
        const addEmailButton = this.container.querySelector("#btn-add-email");
        addEmailButton.disabled = true;
        addEmailButton.innerText = "New email has been added"
    }

    async addEmail(event) {
        if (this.emails.has(newLanguage)) {
            return;
        }

        if (this.checkForUnsavedChanges()) {
            alert("Save or reset your changes first");
            return;
        }

        this.disableAddEmailButton();

        this.emails.set(newLanguage, emailTemplate);

        const emailSelector = this.container.querySelector("#email-selector");
        const option = document.createElement("option");
        option.innerText = newLanguage;
        emailSelector.appendChild(option);
        await this.selectEmail(newLanguage);

        await this.submitChanges();
    }

    resetChanges() {
        this.container.querySelector("#input-language").value = this.savedValues.language;
        this.container.querySelector("#input-subject").value = this.savedValues.subject;
        this.container.querySelector("#input-sender-address").value = this.savedValues.senderAddress;
        this.container.querySelector("#input-cc-recipient").value = this.savedValues.ccRecipient;
        this.container.querySelector("#input-text").value = this.savedValues.text;
        this.visualiseUnsavedChanges();
    }

    async submitChanges() {
        this.container.querySelector("#btn-submit").innerText = "Saving …";
        this.container.querySelector("#btn-submit").disabled = true;

        const newLanguage = this.container.querySelector("#input-language").value;

        await this.dataService.updateQuestionnaireEmail(
            this.questionnaireName,
            this.savedValues.language,
            {
                language: this.container.querySelector("#input-language").value,
                subject: this.container.querySelector("#input-subject").value,
                senderAddress: this.container.querySelector("#input-sender-address").value,
                ccRecipient: this.container.querySelector("#input-cc-recipient").value,
                text: this.container.querySelector("#input-text").value
            }
        );

        await this.update();
        await this.selectEmail(newLanguage);
    }
}
