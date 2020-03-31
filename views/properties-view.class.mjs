export {PropertiesView};

const htmlTemplate = `
    <style>
        table { width: 100%; }
        input { width: 100%; box-sizing: border-box; }
        td:first-child {
            text-align: right;
            padding-right: 20px;
        }
    </style>

    <table>
        <tr>
            <td>Name</td>
            <td><input class="form-control" id="input-name"></td>
        </tr>

        <tr>
            <td>Picture URL</td>
            <td><input class="form-control" id="input-pictureUrl"></td>
        </tr>

        <tr>
            <td>Public</td>
            <td><input type="checkbox" id="input-public"></td>
        </tr>
    </table>

    <button id="btn-submit" class="btn btn-primary">Save</button>
`;

class PropertiesView {
    constructor (container, dataService, questionnaireKey) {
        this.container = container;
        this.dataService = dataService;
        this.questionnaireKey = questionnaireKey;

        this.properties = [
            "name",
            "pictureUrl"
        ];

        this.booleanProperties = [
            "public"
        ];

        this.update();
    }

    async update() {
        this.container.innerHTML = htmlTemplate;

        const properties = await this.dataService.getQuestionnaireProperties(this.questionnaireKey);

        for (const property in properties) {
            if (this.booleanProperties.includes(property)) {
                this.container.querySelector("#input-" + property).checked = properties[property];
            } else  {
                this.container.querySelector("#input-" + property).value = properties[property];
            }
        }

        this.container.querySelector("#btn-submit").addEventListener("click", this.save.bind(this));
    }

    async save() {
        const inputs = this.container.querySelectorAll("input");
        for (const input of inputs) {
            input.disabled = true;
        }

        const submitButton = this.container.querySelector("#btn-submit");
        submitButton.disabled = true;
        submitButton.innerText = "Saving …";

        const propertyValues = new Map();

        for (const property of this.properties) {
            const value = this.container.querySelector("#input-" + property).value;
            propertyValues.set(property, value);
        }

        for (const booleanProperty of this.booleanProperties) {
            const value = this.container.querySelector("#input-" + booleanProperty).checked;
            propertyValues.set(booleanProperty, value);
        }

        await this.dataService.updateQuestionnaireProperties (this.questionnaireKey, propertyValues);
        this.update();
    }
}
