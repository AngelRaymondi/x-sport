"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const x_sport_1 = __importStar(require("./x-sport"));
const readline_1 = __importDefault(require("readline"));
const cli_color_1 = __importDefault(require("cli-color"));
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
const analize = async () => {
    const url = await input("Introduce la url:", (answer) => answer.startsWith("https://www.flashscore.com/match/") &&
        answer.endsWith("/") &&
        answer.length ===
            "https://www.flashscore.com/match/bPgTL24A/".length);
    console.log('Regla de filtrado\n\tEjm.: 2.5\nEn el ejemplo, "2.5" es el número mínimo de puntos por tablero(home, away, overall)');
    const rule_filters = {
        first: parseFloat(await input("5 Últimos local:", (t) => !isNaN(parseFloat(t)))),
        second: parseFloat(await input("5 Últimos visitante:", (t) => !isNaN(parseFloat(t)))),
        home: parseFloat(await input("Local:", (t) => !isNaN(parseFloat(t)))),
        away: parseFloat(await input("Visita:", (t) => !isNaN(parseFloat(t)))),
    };
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
    console.log();
    const { first_overall: first_average_points, second_overall: second_average_points, home: home_average_points, away: away_average_points, } = match.average_points;
    const { first_overall: first_total_points, second_overall: second_total_points, home: home_total_points, away: away_total_points, } = match.total_points;
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
    let first_filtered = first_total_points.filter((e) => e >= rule_filters.first);
    let second_filtered = second_total_points.filter((e) => e >= rule_filters.second);
    let home_filtered = home_total_points.filter((e) => e >= rule_filters.home);
    let away_filtered = away_total_points.filter((e) => e >= rule_filters.away);
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
    const quote = ((0, x_sport_1.get_average)(first_filtered) +
        (0, x_sport_1.get_average)(second_filtered) +
        (0, x_sport_1.get_average)(home_filtered) +
        (0, x_sport_1.get_average)(away_filtered)) /
        4;
    // console.log(
    //      "Apostable(Referente a los puntos con regla de filtro)",
    //      quote.toFixed(2),
    //      `=> Mayor o igual a`,
    //      match.prognostic.calculate('high'), //https://www.flashscore.com/match/tYAmldPN/ da NaN
    //      "puntos"
    //      // ((first_filtered.length +
    //      //      second_filtered.length +
    //      //      home_filtered.length +
    //      //      away_filtered.length) /
    //      //      20) *
    //      //      100 +
    //      //      "%"
    // );
    console.log("\n".repeat(3));
    console.log("OVERALL-FIRST");
    console.table(match.overall.first.map((e) => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`,
    })));
    console.log();
    console.log("OVERALL-SECOND");
    console.table(match.overall.second.map((e) => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`,
    })));
    console.log();
    console.log("HOME");
    console.table(match.home.map((e) => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`,
    })));
    console.log();
    console.log("OVERALL-VISITA");
    console.table(match.away.map((e) => ({
        name: `${e.participants[0].name} - ${e.participants[1].name}`,
        result: `${e.participants[0].points} - ${e.participants[1].points}`,
    })));
    console.log('\n'.repeat(3));
    console.log(cli_color_1.default.yellow('CONCLUSIONES: '));
    console.log("Cantidad de puntos: ");
    console.log("\nEn el mejor de los casos:", cli_color_1.default.yellow(`Mayor o igual a ${Math.round(parseFloat(quote.toFixed(2)))}`));
    console.log(`En el caso normal: ${cli_color_1.default.yellow(`Mayor o igual a ${match.prognostic.calculate("high")}`)}`);
    console.log(`Uno de los casos asegurados${cli_color_1.default.yellow('*')}: ${cli_color_1.default.yellow(`Mayor o igual a ${match.prognostic.calculate("low")}`)}`);
    console.log('\n'.repeat(2));
    await input("¿Analizar otro evento? Se eliminará el contenido (:y)", (e) => e === ":y");
    console.clear();
    return analize();
};
analize();
