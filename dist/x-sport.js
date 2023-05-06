"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_average = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const get_average = (array) => array.reduce((a, b) => a + b, 0) / array.length || 0;
exports.get_average = get_average;
const selectors = {
    h2h: 'a[href="#/h2h"]',
    overall: [
        "div.h2h__section:nth-child(1)",
        "div.h2h__section:nth-child(2)",
    ],
    home: "a.subTabs__tab:nth-child(2)",
    away: "a.subTabs__tab:nth-child(3)",
};
class XSport {
    analize;
    constructor() {
        this.analize = async (match) => {
            const browser = await puppeteer_1.default.launch({
                headless: false,
                timeout: 5 * 1000 * 60
            });
            console.log("Browser launched!");
            const page = await browser.newPage();
            console.log("Entering website...");
            await page.goto(match);
            console.log("Going to overall...");
            await page.waitForSelector(selectors.h2h, {
                timeout: 5 * 60 * 1000,
            });
            await page.$eval(selectors.h2h, (e) => e.click());
            await page.waitForNavigation({
                timeout: 5 * 60 * 1000,
            });
            console.log("Extracting first overall");
            await page.waitForSelector(selectors.overall[0], {
                timeout: 5 * 60 * 1000,
            });
            await page.waitForSelector(selectors.overall[1], {
                timeout: 5 * 60 * 1000,
            });
            await page.waitForSelector(selectors.home, {
                timeout: 5 * 60 * 1000,
            });
            await page.waitForSelector(selectors.away, {
                timeout: 5 * 60 * 1000,
            });
            const first_overall = await page.$(selectors.overall[0]);
            const second_overall = await page.$(selectors.overall[1]);
            const first_overall_matches = await first_overall.$$(".h2h__row");
            const second_overall_matches = await second_overall.$$(".h2h__row");
            let first_overall_data = [];
            let second_overall_data = [];
            for (const match of first_overall_matches) {
                const date = await match.$eval(".h2h__date", (el) => el.innerText);
                const event = await match.$eval(".h2h__event .flag", (el) => el.getAttribute("title"));
                const result = await match.$(".h2h__result");
                const match_data = {
                    date,
                    event,
                    participants: [
                        {
                            name: await match.$eval(".h2h__participant:nth-child(3)", (el) => el.innerText.trim()),
                            points: await result.$eval("span:nth-child(1)", (el) => parseFloat(el.innerText)),
                        },
                        {
                            name: await match.$eval(".h2h__participant:nth-child(4)", (el) => el.innerText.trim()),
                            points: await result.$eval("span:nth-child(2)", (el) => parseFloat(el.innerText)),
                        },
                    ],
                };
                first_overall_data.push(match_data);
            }
            for (const match of second_overall_matches) {
                const date = await match.$eval(".h2h__date", (el) => el.innerText);
                const event = await match.$eval(".h2h__event .flag", (el) => el.getAttribute("title"));
                const result = await match.$(".h2h__result");
                let participant_1_points = null;
                try {
                    participant_1_points = await result.$eval("span:nth-child(1)", (el) => parseFloat(el.innerText));
                }
                catch {
                    participant_1_points = null;
                }
                let participant_2_points = null;
                try {
                    participant_2_points = await result.$eval("span:nth-child(2)", (el) => parseFloat(el.innerText));
                }
                catch {
                    participant_2_points = null;
                }
                const match_data = {
                    date,
                    event,
                    participants: [
                        {
                            name: await match.$eval(".h2h__participant:nth-child(3)", (el) => el.innerText.trim()),
                            points: participant_1_points,
                        },
                        {
                            name: await match.$eval(".h2h__participant:nth-child(4)", (el) => el.innerText.trim()),
                            points: participant_2_points,
                        },
                    ],
                };
                second_overall_data.push(match_data);
            }
            console.log("Going to home...");
            await page.$eval(selectors.home, (e) => e.click());
            const home_section = await page.$("div.h2h__section");
            const home_matches = await home_section.$$(".h2h__row");
            const home_data = [];
            for (const match of home_matches) {
                const date = await match.$eval(".h2h__date", (el) => el.innerText);
                const event = await match.$eval(".h2h__event .flag", (el) => el.getAttribute("title"));
                const result = await match.$(".h2h__result");
                const match_data = {
                    date,
                    event,
                    participants: [
                        {
                            name: await match.$eval(".h2h__participant:nth-child(3)", (el) => el.innerText.trim()),
                            points: await result.$eval("span:nth-child(1)", (el) => parseFloat(el.innerText)),
                        },
                        {
                            name: await match.$eval(".h2h__participant:nth-child(4)", (el) => el.innerText.trim()),
                            points: await result.$eval("span:nth-child(2)", (el) => parseFloat(el.innerText)),
                        },
                    ],
                };
                home_data.push(match_data);
            }
            console.log("Going to away...");
            await page.$eval(selectors.away, (e) => e.click());
            const away_section = await page.$("div.h2h__section");
            const away_matches = await away_section.$$(".h2h__row");
            const away_data = [];
            for (const match of away_matches) {
                const date = await match.$eval(".h2h__date", (el) => el.innerText);
                const event = await match.$eval(".h2h__event .flag", (el) => el.getAttribute("title"));
                const result = await match.$(".h2h__result");
                let participant_1_points = null;
                try {
                    participant_1_points = await result.$eval("span:nth-child(1)", (el) => parseFloat(el.innerText));
                }
                catch {
                    participant_1_points = null;
                }
                let participant_2_points = null;
                try {
                    participant_2_points = await result.$eval("span:nth-child(2)", (el) => parseFloat(el.innerText));
                }
                catch {
                    participant_2_points = null;
                }
                const match_data = {
                    date,
                    event,
                    participants: [
                        {
                            name: await match.$eval(".h2h__participant:nth-child(3)", (el) => el.innerText.trim()),
                            points: participant_1_points,
                        },
                        {
                            name: await match.$eval(".h2h__participant:nth-child(4)", (el) => el.innerText.trim()),
                            points: participant_2_points,
                        },
                    ],
                };
                away_data.push(match_data);
            }
            console.log("Finished!");
            await browser.close();
            let first_total_points = [];
            for (const m of first_overall_data) {
                let total_points = 0;
                for (const participant of m.participants) {
                    total_points += participant.points;
                }
                first_total_points.push(total_points);
            }
            let first_average_points = (0, exports.get_average)(first_total_points);
            let second_total_points = [];
            for (const m of second_overall_data) {
                let total_points = 0;
                for (const participant of m.participants) {
                    total_points += participant.points;
                }
                second_total_points.push(total_points);
            }
            let second_average_points = (0, exports.get_average)(second_total_points);
            let home_total_points = [];
            for (const m of home_data) {
                let total_points = 0;
                for (const participant of m.participants) {
                    total_points += participant.points;
                }
                home_total_points.push(total_points);
            }
            let home_average_points = (0, exports.get_average)(home_total_points);
            let away_total_points = [];
            for (const m of away_data) {
                let total_points = 0;
                for (const participant of m.participants) {
                    total_points += participant.points;
                }
                away_total_points.push(total_points);
            }
            let away_average_points = (0, exports.get_average)(away_total_points);
            let prognostic = (accuracy) => {
                let rule_filter = 0;
                if (accuracy === "high") {
                    rule_filter = 2.5;
                }
                else if (accuracy === "low") {
                    rule_filter = 0;
                }
                else {
                    rule_filter = accuracy;
                }
                let first_filtered = first_total_points.filter((e) => e >= rule_filter);
                let second_filtered = second_total_points.filter((e) => e >= rule_filter);
                let home_filtered = home_total_points.filter((e) => e >= rule_filter);
                let away_filtered = away_total_points.filter((e) => e >= rule_filter);
                const quote = ((0, exports.get_average)(first_filtered) +
                    (0, exports.get_average)(second_filtered) +
                    (0, exports.get_average)(home_filtered) +
                    (0, exports.get_average)(away_filtered)) /
                    4;
                return Math.trunc(Math.round(parseFloat(quote.toFixed(2))) / 2);
            };
            return {
                overall: {
                    first: first_overall_data,
                    second: second_overall_data,
                },
                home: home_data,
                away: away_data,
                prognostic: {
                    calculate: prognostic,
                },
                average_points: {
                    first_overall: first_average_points,
                    second_overall: second_average_points,
                    home: home_average_points,
                    away: away_average_points,
                },
                total_points: {
                    first_overall: first_total_points,
                    second_overall: second_total_points,
                    home: home_total_points,
                    away: away_total_points,
                },
            };
            //1    -    8x                MÁS RECIENTE
            //2    -    7x
            //3    -    6.5x
            //4    -    5x
            //5    -    4.5x
            //6    -    4x
            //7    -    3.5x
            //8    -    3x
            //9    -    2x
            //10   -    1x                MÁS ANTIGUO
        };
    }
}
exports.default = XSport;
