import {QuestionnaireView} from "./questionnaire-view.class.mjs";

export {MainView};

const htmlTemplate = `
    <div class="grid-menu" id="admin-panel" style="display: none">
        <input id="input-new-questionnaire-key" class="form-control">
        <div id="button-new-questionnaire">New questionnaire</div>
    </div>

    <hr>

    <div class="grid-menu" id="list"></div>
`;

class MainView {
    constructor (container, dataService, menuBar) {
        this.container = container;
        this.dataService = dataService;
        this.menuBar = menuBar;

        this.questionnaireKeys = [];

        this.menuBar.querySelector("a:first-child").style.cursor = "pointer";
        this.menuBar.querySelector("a:first-child").addEventListener("click", this.closeQuestionnaire.bind(this));

        this.update();
    }

    async update() {
        this.container.innerHTML = htmlTemplate;

        if (this.dataService.amIAdmin()) {
            this.container.querySelector("#admin-panel").style.display = "grid";
        }

        this.container.querySelector("#button-new-questionnaire").addEventListener("click", this.handleNewQuestionnaireClick.bind(this));

        this.questionnaireKeys = await this.dataService.getQuestionnaireKeys();

        for (const questionnaireKey of this.questionnaireKeys) {
            const button = document.createElement("div");
            button.innerHTML = questionnaireKey;
            button.addEventListener("click", () => {
                this.openQuestionnaire(questionnaireKey);
            });
            document.querySelector("#list").appendChild(button);
        }
    }

    async closeQuestionnaire (event) {
        this.update();
    }

    openQuestionnaire (key) {
        this.container.querySelector("#list").innerHTML = "";
        const questionnaireView = new QuestionnaireView(this.container, this.dataService, this.closeQuestionnaire.bind(this), key);
    }

    async handleNewQuestionnaireClick (event) {
        const input = this.container.querySelector("#input-new-questionnaire-key");

        if (!input.value) {
            input.focus();
        } else if (input.value === "all") {
            alert("The key 'all' is not allowed in this system.");
        } else if (this.questionnaireKeys.includes(input.value)) {
            alert("The key " + input.value + " is already taken.");
        } else {
            event.target.disabled = true;

            try { 
                await this.dataService.createQuestionnaire(input.value);
            } catch (error) {
                alert("Error while creating the questionnaire.");
            }

            await this.update();
        }
    }
}
