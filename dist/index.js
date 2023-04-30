"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const x_sport_1 = __importDefault(require("./x-sport"));
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface(process.stdin, process.stdout);
const input = (text, filter = () => true) => {
    return new Promise((resolve) => {
        rl.question(text + " ", async (answer) => {
            if (!filter(answer)) {
                resolve(await input(text, filter));
            }
            else {
                resolve(answer);
                return;
            }
        });
    });
};
(async () => {
    const url = await input("Introduce la url:", (answer) => answer.startsWith("https://www.flashscore.com/match/") &&
        answer.endsWith("/") &&
        answer.length ===
            "https://www.flashscore.com/match/bPgTL24A/".length);
    console.log('Regla de filtrado\n\tEjm.: (x) => x >= 2\nEn el ejemplo, "x" es el número de puntos por tablero(home, away, overall)');
    const rule_filters = {
        first: await input('5 Últimos local:'),
        second: await input('5 Últimos visitante:'),
        home: await input('Local:'),
        away: await input('Visita:'),
    };
    rl.close();
    console.clear();
    const client = new x_sport_1.default();
    const match = await client.analize(url);
    console.clear();
    const both_score = (array) => {
        return array.filter((m) => {
            for (const participant of m.participants) {
                if (participant.points >= 1) {
                    continue;
                }
                else {
                    return false;
                }
            }
            return true;
        });
    };
    const get_average = (array) => array.reduce((a, b) => a + b, 0) / array.length;
    let first_total_points = [];
    for (const m of match.overall.first) {
        let total_points = 0;
        for (const participant of m.participants) {
            total_points += participant.points;
        }
        first_total_points.push(total_points);
    }
    let first_average_points = get_average(first_total_points);
    let second_total_points = [];
    for (const m of match.overall.second) {
        let total_points = 0;
        for (const participant of m.participants) {
            total_points += participant.points;
        }
        second_total_points.push(total_points);
    }
    let second_average_points = get_average(second_total_points);
    let home_total_points = [];
    for (const m of match.home) {
        let total_points = 0;
        for (const participant of m.participants) {
            total_points += participant.points;
        }
        home_total_points.push(total_points);
    }
    let home_average_points = get_average(home_total_points);
    let away_total_points = [];
    for (const m of match.away) {
        let total_points = 0;
        for (const participant of m.participants) {
            total_points += participant.points;
        }
        away_total_points.push(total_points);
    }
    let away_average_points = get_average(away_total_points);
    console.log();
    let first_filtered = first_total_points.filter(eval(rule_filters.first));
    let second_filtered = second_total_points.filter(eval(rule_filters.second));
    let home_filtered = home_total_points.filter(eval(rule_filters.home));
    let away_filtered = away_total_points.filter(eval(rule_filters.away));
    console.log("PROMEDIO DE PUNTOS[NO FILTRADO]:");
    console.table({
        "5 Últimos local": first_average_points,
        "5 Últimos visita": second_average_points,
        local: home_average_points,
        visita: away_average_points,
    });
    console.log();
    console.log("PUNTOS TOTALES[NO FILTRADO]: ");
    console.table({
        "5 Últimos local": first_total_points,
        "5 Últimos visita": second_total_points,
        local: home_total_points,
        visita: away_total_points,
    });
    console.log();
    console.log(`FILTRADO:\nREGLA DE FILTRO:\n${JSON.stringify(rule_filters, null, 3)}`);
    console.table({
        "5 Últimos local": first_filtered,
        "5 Últimos visita": second_filtered,
        local: home_filtered,
        visita: away_filtered,
    });
    console.log();
    console.log("AMBOS ANOTAN:");
    console.table({
        "5 Últimos local": both_score(match.overall.first).length,
        "5 Últimos visita": both_score(match.overall.second).length,
        local: both_score(match.home).length,
        visita: both_score(match.away).length,
    });
    console.log();
    console.log("Apostable (%)", ((first_filtered.length +
        second_filtered.length +
        home_filtered.length +
        away_filtered.length) /
        20) *
        100 +
        "%");
    console.log('\n'.repeat(3));
    console.log('OVERALL-FIRST');
    console.table(match.overall.first.map(e => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`
    })));
    console.log();
    console.log('OVERALL-SECOND');
    console.table(match.overall.second.map(e => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`
    })));
    console.log();
    console.log('HOME');
    console.table(match.home.map(e => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`
    })));
    console.log();
    console.log('OVERALL-VISITA');
    console.table(match.away.map(e => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`
    })));
})();
