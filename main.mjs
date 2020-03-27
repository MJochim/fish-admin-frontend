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
        const container = document.querySelector("#container");
        const menuBar = document.querySelector("#menu");
        const mainView = new MainView(container, dataService, menuBar);

        const logoutButton = document.querySelector("#logout");
        logoutButton.style.cursor = "pointer";
        logoutButton.addEventListener("click", (event) => {
            dataService.logout();
        });
    } else {
        const container = document.querySelector("#container");
        container.innerHTML = accessDeniedTemplate;
    }
})();
