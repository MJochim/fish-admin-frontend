export {OwnershipView};

const htmlTemplate = `
Managing questionnaire ownership is not yet implemented.
`;

class OwnershipView {
    constructor (container, dataService) {
        this.container = container;
        this.dataService = dataService;

        this.update();
    }

    async update() {
        this.container.innerHTML = htmlTemplate;
    }
}
