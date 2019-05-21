// (C) 2007-2019 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUsingLoginForm } from "./utils/helpers";

fixture("Chart configuration")
    .page(config.url)
    .beforeEach(loginUsingLoginForm(`${config.url}/advanced/chart-configuration`));

test("should be able to change configuration of bucket component chart and render them", async t => {
    const changePaletteBtn = Selector(".s-bar-chart .s-change-palette");
    const changeLegendBtn = Selector(".s-bar-chart .s-change-legend");
    const changeSeparatorBtn = Selector(".s-bar-chart .s-change-separator");
    const legend = Selector(".s-bar-chart .viz-legend");
    const barChart = Selector(".s-bar-chart");
    const tooltip = Selector(".gd-viz-tooltip-table-row .gd-viz-tooltip-table-value");

    await t
        .expect(barChart.visible)
        .ok()
        .expect(legend.visible)
        .ok()
        .expect(legend.hasClass("position-top"))
        .ok()
        .click(Selector(".highcharts-series-1 rect").nth(0))
        .wait(500)
        .expect(tooltip.nth(1).textContent)
        .eql("1,179,436");

    await t
        .expect(changeLegendBtn.visible)
        .ok()
        .click(changeLegendBtn)
        .expect(barChart.visible)
        .ok()
        .expect(legend.hasClass("position-right"))
        .ok()
        .click(changeLegendBtn)
        .expect(legend.exists)
        .notOk();

    await t
        .expect(changeSeparatorBtn.visible)
        .ok()
        .click(changeSeparatorBtn)
        .expect(barChart.visible)
        .ok()
        .click(barChart.find(".highcharts-series-1 rect").nth(0))
        .wait(500)
        .expect(tooltip.nth(1).textContent)
        .eql("1.179.436");

    await t
        .expect(changePaletteBtn.visible)
        .ok()
        .click(changePaletteBtn)
        .expect(barChart.visible)
        .ok()
        .expect(
            barChart
                .find(".highcharts-series-1 rect")
                .nth(0)
                .getAttribute("fill"),
        )
        .eql("rgb(168,194,86)");
});

test("should be able to change configuration of visualization chart and render them", async t => {
    const changePaletteBtn = Selector(".s-visualization-column .s-change-palette");
    const changeLegendBtn = Selector(".s-visualization-column .s-change-legend");
    const changeSeparatorBtn = Selector(".s-visualization-column .s-change-separator");
    const legend = Selector(".s-visualization-column .viz-legend");
    const columnChart = Selector(".s-visualization-column");
    const tooltip = Selector(".gd-viz-tooltip-table-row .gd-viz-tooltip-table-value");

    await t
        .hover(columnChart)
        .expect(columnChart.visible)
        .ok()
        .expect(legend.visible)
        .ok()
        .expect(legend.hasClass("position-top"))
        .ok()
        .click(columnChart.find(".highcharts-series-1 rect").nth(0))
        .wait(500)
        .expect(tooltip.nth(1).textContent)
        .eql("$1,179,436");

    await t
        .expect(changeLegendBtn.visible)
        .ok()
        .click(changeLegendBtn)
        .expect(columnChart.visible)
        .ok()
        .expect(legend.hasClass("position-right"))
        .ok()
        .click(changeLegendBtn)
        .expect(legend.exists)
        .notOk();

    await t
        .expect(changeSeparatorBtn.visible)
        .ok()
        .click(changeSeparatorBtn)
        .expect(columnChart.visible)
        .ok()
        .click(columnChart.find(".highcharts-series-1 rect").nth(0))
        .wait(500)
        .expect(tooltip.nth(1).textContent)
        .eql("$1.179.436");

    await t
        .expect(changePaletteBtn.visible)
        .ok()
        .click(changePaletteBtn)
        .expect(columnChart.visible)
        .ok()
        .expect(
            columnChart
                .find(".highcharts-series-1 rect")
                .nth(0)
                .getAttribute("fill"),
        )
        .eql("rgb(168,194,86)");
});
