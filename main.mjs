import {DataService} from "./core/data-service.class.mjs";
import {MainView} from "./views/main-view.class.mjs";

const accessDeniedTemplate = `
    Access denied for this account!<br>
    Go back to the <a href="https://keycloak.example.com/">account console</a>.
`;

(async () => {
    const dataService = new DataService();
    await dataService.initialize();

    if (dataService.amIUser()) {
        document.querySelector("#password-container").innerText = await dataService.getPassword();

        const container = document.querySelector("#container");
        const menuBar = document.querySelector("#menu");
        const mainView = new MainView(container, dataService, menuBar);
    } else {
        const container = document.querySelector("#container");
        container.innerHTML = accessDeniedTemplate;
        document.querySelector("#password-container").innerText = "";
    }
})();
