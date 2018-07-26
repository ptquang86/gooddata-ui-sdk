// (C) 2007-2018 GoodData Corporation
import { generateChartOptions } from '../../test/helper';

import * as fixtures from '../../../../../../stories/test_data/fixtures';
import getLegend, {
    shouldLegendBeEnabled,
    getLegendItems,
    DEFAULT_LEGEND_CONFIG
} from '../legendBuilder';
import { VisualizationTypes } from '../../../../..';

describe('shouldLegendBeEnabled', () => {
    it('should return false by default', () => {
        const chartOptions = generateChartOptions(fixtures.barChartWithViewByAttribute);
        expect(shouldLegendBeEnabled(chartOptions)).toBe(false);
    });

    it('should return true if chart has more than one series', () => {
        const chartOptions = generateChartOptions(fixtures.barChartWith3MetricsAndViewByAttribute);
        expect(shouldLegendBeEnabled(chartOptions)).toBe(true);
    });

    it('should return true if pie chart has more than one value', () => {
        const chartOptions = generateChartOptions(fixtures.pieChartWithMetricsOnly, { type: 'pie' });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(true);
    });

    it('should return true if the chart is stacked and has only one stack item', () => {
        const chartOptions = generateChartOptions(fixtures.barChartWithStackByAndOnlyOneStack, { type: 'bar' });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(true);
    });

    it('should return false if the treemap is stacked and has only one measure item', () => {
        const dataSet = fixtures.treemapWithMetricAndStackByAttribute;
        const chartOptions = generateChartOptions(
            dataSet,
            {
                type: 'treemap',
                mdObject: dataSet.mdObject
            });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(false);
    });

    it('should return true if the treemap is stacked and has many measures', () => {
        const dataSet = fixtures.treemapWithTwoMetricsAndStackByAttribute;
        const chartOptions = generateChartOptions(
            dataSet,
            {
                type: 'treemap',
                mdObject: dataSet.mdObject
            });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(true);
    });

    it('should return true if the treemap has many measures', () => {
        const dataSet = fixtures.treemapWithThreeMetrics;
        const chartOptions = generateChartOptions(
            dataSet,
            {
                type: 'treemap',
                mdObject: dataSet.mdObject
            });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(true);
    });

    it('should return false if the treemap has only one measures', () => {
        const dataSet = fixtures.treemapWithOneMetric;
        const chartOptions = generateChartOptions(
            dataSet,
            {
                type: 'treemap',
                mdObject: dataSet.mdObject
            });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(false);
    });

    it('should return true if the treemap has view by and has only one view by item', () => {
        const dataSet = fixtures.treemapWithMetricAndViewByAndOnlyOneElement;
        const chartOptions = generateChartOptions(
            dataSet,
            {
                type: 'treemap',
                mdObject: dataSet.mdObject
            });
        expect(shouldLegendBeEnabled(chartOptions)).toBe(true);
    });

    it('should return true if chart is heatmap with multiple dataClasses', () => {
        const chartOptions = {
            type: VisualizationTypes.HEATMAP,
            colorAxis: {
                dataClasses: [
                    { from: 1, to: 2 },
                    { from: 2, to: 3 }
                ]
            }
        };

        expect(shouldLegendBeEnabled(chartOptions)).toEqual(true);
    });

    it('should return false when chart is heatmap with single dataClass', () => {
        const chartOptions = {
            type: VisualizationTypes.HEATMAP,
            colorAxis: {
                dataClasses: [{ from: 7, to: 7 }]
            }
        };

        expect(shouldLegendBeEnabled(chartOptions)).toEqual(false);
    });
});

describe('getLegendItems', () => {
    it('should return correct legend items for regular charts', () => {
        const chartOptions = generateChartOptions(fixtures.barChartWithStackByAndViewByAttributes);
        expect(getLegendItems(chartOptions)).toEqual([
            {
                color: 'rgb(20,178,226)',
                legendIndex: 0,
                name: 'East Coast'
            },
            {
                color: 'rgb(0,193,141)',
                legendIndex: 1,
                name: 'West Coast'
            }
        ]);
    });

    it('should return correct legend items for pie charts', () => {
        const chartOptions = generateChartOptions(fixtures.pieChartWithMetricsOnly, { type: 'pie' });
        expect(getLegendItems(chartOptions)).toEqual([
            {
                color: 'rgb(20,178,226)',
                legendIndex: 0,
                name: 'Won'
            },
            {
                color: 'rgb(0,193,141)',
                legendIndex: 1,
                name: 'Lost'
            },
            {
                color: 'rgb(229,77,66)',
                legendIndex: 2,
                name: 'Expected'
            }
        ]);
    });

    it('should return correct legend items for heatmap', () => {
        const chartOptions = {
            type: VisualizationTypes.HEATMAP,
            colorAxis: {
                dataClasses: [{
                    from: 0,
                    to: 10,
                    color: 'color1'
                }, {
                    from: 0.5,
                    to: 0.8,
                    color: 'color2'
                }]
            }
        };

        const expectedItems = [{
            range: { from: 0, to: 10 },
            color: 'color1',
            legendIndex: 0
        }, {
            range: { from: 0.5, to: 0.8 },
            color: 'color2',
            legendIndex: 1
        }];

        expect(getLegendItems(chartOptions)).toEqual(expectedItems);
    });
});

describe('getLegend', () => {
    const chartOptions = generateChartOptions(fixtures.barChartWith3MetricsAndViewByAttribute);
    const legend = getLegend({}, chartOptions);

    it('should assign enabled: false if disabled by config', () => {
        const disabledLegend = getLegend({ enabled: false }, chartOptions);
        expect(disabledLegend.enabled).toBe(false);
    });

    it('should assign enabled: true for multi metric graph', () => {
        expect(legend.enabled).toBe(true);
    });

    it('should assign default position', () => {
        expect(legend.position).toBe(DEFAULT_LEGEND_CONFIG.position);
    });

    it('should be able to override default position', () => {
        const legendWithCustomPosition = getLegend({ position: 'left' }, chartOptions);
        expect(legendWithCustomPosition.position).toBe('left');
    });

    it('should assign items', () => {
        const legendItems = getLegendItems(chartOptions);
        expect(legend.items).toEqual(legendItems);
    });

    it('should set legend position to top for heatmap', () => {
        const chartOptions = { type: VisualizationTypes.HEATMAP };
        const legendConfig = {};
        const legend = getLegend(legendConfig, chartOptions);

        expect(legend.position).toEqual('top');
    });
});
