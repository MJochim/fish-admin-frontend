import {QuestionnaireView} from "./questionnaire-view.class.mjs";

export {MainView};

const htmlTemplate = `
    <div class="grid-menu" id="admin-panel" style="display: none">
        <input id="input-new-questionnaire-name" class="form-control">
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

        this.questionnaireNames = [];

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

        this.questionnaireNames = await this.dataService.getQuestionnaireNames();

        for (const questionnaireName of this.questionnaireNames) {
            const button = document.createElement("div");
            button.innerHTML = questionnaireName;
            button.addEventListener("click", () => {
                this.openQuestionnaire(questionnaireName);
            });
            document.querySelector("#list").appendChild(button);
        }
    }

    async closeQuestionnaire (event) {
        this.update();
    }

    openQuestionnaire (name) {
        this.container.querySelector("#list").innerHTML = "";
        const questionnaireView = new QuestionnaireView(this.container, this.dataService, name);
    }

    async handleNewQuestionnaireClick (event) {
        const input = this.container.querySelector("#input-new-questionnaire-name");

        if (!input.value) {
            input.focus();
        } else if (input.value === "all") {
            alert("The name 'all' is not allowed in this system.");
        } else if (this.questionnaireNames.includes(input.value)) {
            alert("The name " + input.value + " is already taken.");
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
