"use strict";

import {DataService} from "./core/data-service.class.mjs";
import {MainView} from "./views/main-view.class.mjs";

(async () => {

    const dataService = new DataService();
    await dataService.initialize();

    const searchParams = new URLSearchParams(window.location.search)
    const conferenceKey = searchParams.get("conferenceKey");
    const dataset = await dataService.getQuestionnaireResponses(conferenceKey);
    let csvData = "";

    const table = document.querySelector("#table");
    const descriptionContainer = document.querySelector("#description");

    const keys = new Set();

    for (const record of dataset) {
        for (const column in record) {
            keys.add(column);
        }
    }

//        dataset.sort((x,y) => x.ip < y.ip);
    dataset.sort((x,y) => x.time < y.time);
//        dataset.sort((x,y) => x.vote < y.vote);
//        dataset.sort((x,y) => x.item3 < y.item3);
    
    const head = document.createElement("thead");
    head.classList.add("thead-dark");
    const headerRow = document.createElement("tr");
    head.appendChild(headerRow);
    table.appendChild(head);

    for (const key of keys) {
        const cell = document.createElement("th");
        cell.innerText = key;
        headerRow.appendChild(cell);

        csvData += '"' + key.replace(/\"/g, '\"') + '",';
    }

    // Remove the last comma
    csvData = csvData.substring(0, csvData.length-1);

    csvData += "\n";

    const body = document.createElement("tbody");

    for (const record of dataset) {
        const row = document.createElement("tr");

        for (const key of keys) {
            const cell = document.createElement("td");
            cell.innerText = record[key];
            row.appendChild(cell);

            if (typeof record[key] === "string") {
                const escapedString = record[key].replace(/"/g, '""');
                csvData += '"' + escapedString + '",';
            } else {
                csvData += record[key] + ',';
            }
        }

        // Remove the last comma
        csvData = csvData.substring(0, csvData.length-1);

        csvData += "\n";
        body.appendChild(row);
    }

    table.appendChild(body);

    descriptionContainer.appendChild(document.createElement("h1"));
    descriptionContainer.children[0].innerText = conferenceKey;
    descriptionContainer.appendChild(document.createElement("div"));
    descriptionContainer.children[1].innerHTML = "Einträge/entries: " + dataset.length + "<br>" + "Spalten/columns: " + keys.size;
    
    document.querySelector("#download-link").setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData));
    document.querySelector("#download-link").setAttribute("download", "responses.csv");
})();
