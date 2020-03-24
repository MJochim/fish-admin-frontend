import {EmailView} from "./email-view.class.mjs";
import {LabelsView} from "./labels-view.class.mjs";
import {OwnershipView} from "./ownership-view.class.mjs";

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
            <div id="btn-data-table">Data table</div>
        </div>
    </div>
`;

class QuestionnaireView {
    constructor (container, dataService, questionnaireName) {
        this.container = container;
        this.dataService = dataService;
        this.name = questionnaireName;

        this.update();
    }

    async update() {
        this.container.innerHTML = htmlTemplate;
        this.container.querySelector("h1").innerHTML = this.name;
        this.container.querySelector("#link-back").addEventListener("click", this.update.bind(this));

        const subcontainer = this.container.querySelector(".subcontainer");
        
        this.container.querySelector("#btn-email").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new EmailView(subcontainer, this.dataService, this.name);
        });
        
        this.container.querySelector("#btn-labels").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new LabelsView(subcontainer, this.dataService, this.name);
        });
        
        this.container.querySelector("#btn-ownership").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            new OwnershipView(subcontainer, this.dataService, this.name);
        });
        
        this.container.querySelector("#btn-data-table").addEventListener("click", () => {
            this.container.querySelector("#link-back").style.display = "inline";
            window.open("questionnaire-responses.html?conferenceKey=" + encodeURIComponent(this.name));
        });
    }
}
