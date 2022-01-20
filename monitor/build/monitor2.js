var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { DefaultAzureCredential } from "@azure/identity";
import { Durations, MetricsQueryClient } from "@azure/monitor-query";
import * as dotenv from "dotenv";
dotenv.config();
const metricsResourceId = process.env.METRICS_RESOURCE_ID;
export function main() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const tokenCredential = new DefaultAzureCredential();
        const metricsQueryClient = new MetricsQueryClient(tokenCredential);
        if (!metricsResourceId) {
            throw new Error("METRICS_RESOURCE_ID must be set in the environment for this sample");
        }
        const iterator = metricsQueryClient.listMetricDefinitions(metricsResourceId);
        let result = yield iterator.next();
        let metricNames = [];
        try {
            for (var iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = yield iterator_1.next(), !iterator_1_1.done;) {
                const result = iterator_1_1.value;
                console.log(` metricDefinitions - ${result.id}, ${result.name}`);
                if (result.name) {
                    metricNames.push(result.name);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) yield _a.call(iterator_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const firstMetricName = metricNames[0];
        const secondMetricName = metricNames[1];
        if (firstMetricName && secondMetricName) {
            console.log(`Picking an example metric to query: ${firstMetricName} and ${secondMetricName}`);
            const metricsResponse = yield metricsQueryClient.queryResource(metricsResourceId, [firstMetricName, secondMetricName], {
                granularity: "PT1M",
                timespan: { duration: Durations.fiveMinutes }
            });
            console.log(`Query cost: ${metricsResponse.cost}, interval: ${metricsResponse.granularity}, time span: ${metricsResponse.timespan}`);
            const metrics = metricsResponse.metrics;
            console.log(`Metrics:`, JSON.stringify(metrics, undefined, 2));
            const metric = metricsResponse.getMetricByName(firstMetricName);
            console.log(`Selected Metric: ${firstMetricName}`, JSON.stringify(metric, undefined, 2));
        }
        else {
            console.error(`Metric names are not defined - ${firstMetricName} and ${secondMetricName}`);
        }
    });
}
main().catch((err) => {
    console.error("The sample encountered an error:", err);
    process.exit(1);
});
