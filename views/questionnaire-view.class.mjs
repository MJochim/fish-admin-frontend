import {EmailView} from "./email-view.class.mjs";
import {LabelsView} from "./labels-view.class.mjs";
import {OwnershipView} from "./ownership-view.class.mjs";
import {PropertiesView} from "./properties-view.class.mjs";

export {QuestionnaireView};

const htmlTemplate = `
    <style>
        #link-back { cursor: pointer; display: none; }
    </style>

    <h1></h1>

    <p>
        <a id="link-back">Back</a>
    </p>

    <div class="subcontainer">
        <div class="grid-menu">
            <div id="btn-email">Confirmation emails</div>
            <div id="btn-labels">Labels</div>
            <div id="btn-ownership">Ownership</div>
            <div id="btn-properties">Properties</div>
            <div id="btn-data-table">Data table</div>
            <div id="btn-delete">Delete</div>
        </div>
    </div>
`;

class QuestionnaireView {
    constructor (container, dataService, closeFunction, questionnaireKey) {
        this.container = container;
        this.dataService = dataService;
        this.questionnaireKey = questionnaireKey;
        this.close = closeFunction;

        this.update();
    }

    async update() {
        this.container.innerHTML = htmlTemplate;
        this.container.querySelector("h1").innerHTML = this.questionnaireKey;
        this.container.querySelector("#link-back").addEventListener("click", this.update.bind(this));

        const subcontainer = this.container.querySelector(".subcontainer");
        
        this.container.querySelector("#btn-email").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new EmailView(subcontainer, this.dataService, this.questionnaireKey);
        });
        
        this.container.querySelector("#btn-labels").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new LabelsView(subcontainer, this.dataService, this.questionnaireKey);
        });
        
        this.container.querySelector("#btn-ownership").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new OwnershipView(subcontainer, this.dataService, this.questionnaireKey);
        });
        
        this.container.querySelector("#btn-properties").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new PropertiesView(subcontainer, this.dataService, this.questionnaireKey);
        });

        this.container.querySelector("#btn-data-table").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            window.open("questionnaire-responses.html?conferenceKey=" + encodeURIComponent(this.questionnaireKey));
        });

        this.container.querySelector("#btn-delete").addEventListener("click", async () => {
            const response = prompt(
                "If you delete this questionnaire, all responses will be deleted as well.\n\n" +
                "In the properties menu, you can depublish the questionnaire instead.\n\n" +
                "If you want to delete the questionnaire, type its key (" + this.questionnaireKey + ") below:",
                ""
            );

            if (response === this.questionnaireKey) {
                alert(
                    "The questionnaire “" + this.questionnaireKey + "” will be deleted now.\n\n" +
                    "After that, you will be redirected to the overview of questionnaires."
                );
                subcontainer.innerText = "The questionnaire is being deleted.";
                await this.dataService.deleteQuestionnaire(this.questionnaireKey);
                this.close();
            } else if (response !== null) {
                alert("You typed a wrong key. The questionnaire will not be deleted.");
            }
        });
    }
}

