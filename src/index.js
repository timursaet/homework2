import "babel-polyfill";
import Chart from "chart.js";

//const currencyURL = "www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
 const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

async function loadCurrency() {
    const response = await fetch(meteoURL);
    const xmlTest = await response.text();
    const parser = new DOMParser();
    const meteoData = parser.parseFromString(xmlTest, "text/xml");
    // <Cube currency="USD" rate="1.1321" />
    const temperatures = meteoData.querySelectorAll("TEMPERATURE");
    const result = Object.create(null);
    for (let i = 0; i < temperatures.length; i++) {
        const rateTag = temperatures.item(i);
        const temperature = rateTag.getAttribute("max");
        const currency = rateTag.getAttribute("max");
        result[currency] = temperature;
    }
    // result["EUR"] = 1;
    result["RANDOM"] = 1 + Math.random();
    return result;
}

function normalizeDataByCurrency(data) {
    const result = Object.create(null);
    for (const key of Object.keys(data)) {
        result[key] = data[key];
    }
    return result;
}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function() {
    const currencyData = await loadCurrency();
    const normalData = normalizeDataByCurrency(currencyData);
    const keys = Object.keys(normalData).sort((k1, k2) =>
        compare(normalData[k1], normalData[k2])
    );
    const plotData = keys.map(key => normalData[key]);

    const chartConfig = {
        type: "line",

        data: {
            labels: keys,
            datasets: [
                {
                    label: "Максимальная температура",
                    backgroundColor: "rgb(255, 20, 20)",
                    borderColor: "rgb(180, 0, 0)",
                    data: plotData
                }
            ]
        }
    };

    if (window.chart) {
        chart.data.labels = chartConfig.data.labels;
        chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
        chart.update({
            duration: 800,
            easing: "easeOutBounce"
        });
    } else {
        window.chart = new Chart(canvasCtx, chartConfig);
    }
});

function compare(a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}