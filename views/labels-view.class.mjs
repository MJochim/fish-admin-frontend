export {LabelsView};

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
            <td>Headline</td>
            <td><input class="form-control" id="input-headline"></td>
        </tr>

        <tr>
            <td>Button label: Submit</td>
            <td><input class="form-control" id="input-submit"></td>
        </tr>

        <tr>
            <td>Button label: Abort</td>
            <td><input class="form-control" id="input-abort"></td>
        </tr>

        <tr>
            <td>Button label: Back</td>
            <td><input class="form-control" id="input-back"></td>
        </tr>

        <tr>
            <td>Dialog question: Submit</td>
            <td><input class="form-control" id="input-submitQuestion"></td>
        </tr>

        <tr>
            <td>Error message: Invalid form</td>
            <td><input class="form-control" id="input-errorInvalidForm"></td>
        </tr>

        <tr>
            <td>Error message: Error during submission</td>
            <td><input class="form-control" id="input-errorDuringSubmission"></td>
        </tr>

        <tr>
            <td>Notification: Registration successful</td>
            <td><input class="form-control" id="input-registrationSuccessful"></td>
        </tr>
    </table>

    <button id="btn-submit" class="btn btn-primary">Save</button>
`;

class LabelsView {
    constructor (container, dataService, questionnaireKey) {
        this.container = container;
        this.dataService = dataService;
        this.questionnaireKey = questionnaireKey;

        this.labels = [
            "headline",
            "submit",
            "abort",
            "back",
            "submitQuestion",
            "errorInvalidForm",
            "errorDuringSubmission",
            "registrationSuccessful"
        ];

        this.update();
    }

    async update() {
        this.container.innerHTML = htmlTemplate;

        const labels = await this.dataService.getQuestionnaireLabels(this.questionnaireKey);

        for (const label in labels) {
            this.container.querySelector("#input-" + label).value = labels[label];
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

        const labelValues = new Map();

        for (const label of this.labels) {
            const value = this.container.querySelector("#input-" + label).value;
            labelValues.set(label, value);
        }

        await this.dataService.updateQuestionnaireLabels (this.questionnaireKey, labelValues);
        this.update();
    }
}
