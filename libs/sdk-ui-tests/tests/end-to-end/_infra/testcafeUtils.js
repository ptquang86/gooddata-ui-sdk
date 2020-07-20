// (C) 2007-2020 GoodData Corporation
import { t as testController, Selector } from "testcafe";

function storybookHostname() {
    return process.env.CI === true ? "http://storybook" : "http://localhost:9001";
}

function storyUrl(storyId) {
    return `${storybookHostname()}/iframe.html?id=${storyId}`;
}

/**
 * Creates a function which will open the desired storybook story (specified by ID) - without any other
 * storybook controls and widgets.
 *
 * @param storyId - story id, as generated by storybook (to obtain this ID, click the desired story in storybook, it
 *   will switch the URL which will contain the ID)
 * @return {function(...[*]=)}
 */
export const navigateToStory = (storyId = "/") => async (tc = testController) => {
    await tc.navigateTo(storyUrl(storyId));
};

//
//
//

// retries async check() until it resolves or time runs out
const retry = async (check = async () => true, timeout = 1000, interval = 100, started = Date.now()) => {
    const startTime = Date.now();
    return check().catch((error) => {
        return new Promise((resolve, reject) => {
            const resolveTime = Date.now();
            if (Date.now() + interval > started + timeout) {
                reject(error);
            }
            setTimeout(
                () => retry(check, timeout, interval, started).then(resolve, reject),
                Math.max(startTime - resolveTime + interval, 0),
            );
        });
    });
};

// returns a promise that is resolved with true when selector exists and rejected when it does not
// or the other way around if expectExist is false
export const selectorExists = (query, expectExist = true) =>
    new Promise(async (resolve, reject) => {
        const exists = await Selector(query).exists;
        if (exists === expectExist) {
            resolve(true);
        } else {
            reject();
        }
    });

export const checkRenderChart = async (selector, t) => {
    const loading = Selector(".s-loading");
    const chart = Selector(selector);

    await t.expect(loading.exists).ok();

    await t.expect(chart.exists).ok().expect(chart.textContent).ok();
};

export async function sleep(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export const getElementTexts = async (elements) => {
    return Promise.all(
        Array(elements.count)
            .fill(null)
            .map((_, index) => {
                return elements.nth(index).textContent;
            }),
    );
};