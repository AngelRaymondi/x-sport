"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
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
            });
            console.log("Browser launched!");
            const page = await browser.newPage();
            console.log("Entering website...");
            await page.goto(match);
            console.log("Going to overall...");
            await page.waitForSelector(selectors.h2h);
            await page.$eval(selectors.h2h, (e) => e.click());
            await page.waitForNavigation();
            console.log("Extracting first overall");
            await page.waitForSelector(selectors.overall[0]);
            await page.waitForSelector(selectors.overall[1]);
            await page.waitForSelector(selectors.home);
            await page.waitForSelector(selectors.away);
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
                away_data.push(match_data);
            }
            console.log("Finished!");
            await browser.close();
            return {
                overall: {
                    first: first_overall_data,
                    second: second_overall_data,
                },
                home: home_data,
                away: away_data,
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
