import { Logger } from "@nestjs/common";
import { metrics } from "@opentelemetry/api";
import {
	getNodeAutoInstrumentations,
	getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
	ATTR_SERVICE_NAME,
	ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { setupNodeMetrics } from "@sesamecare-oss/opentelemetry-node-metrics";

const logger = new Logger("OpenTelemetry");

const metricReader = new PrometheusExporter({ port: 8081 }, () =>
	logger.log("Prometheus scrape endpoint started on port 8081"),
);

const resource = resourceFromAttributes({
	[ATTR_SERVICE_NAME]: "N-D-B",
	[ATTR_SERVICE_VERSION]: "1.0.0",
});

const instrumentations = [getNodeAutoInstrumentations()];

export const otelSDK = new NodeSDK({
	resource,
	metricReader,
	instrumentations,
	resourceDetectors: getResourceDetectors(),
});

setImmediate(() => {
	const meterProvider = metrics.getMeterProvider();
	const meter = meterProvider.getMeter("node-metrics");
	setupNodeMetrics(meter, {
		labels: resource.attributes as Record<string, string>,
	});
});

process.on("SIGTERM", () => {
	otelSDK
		.shutdown()
		.then(
			() => logger.verbose("SDK shut down successfully"),
			(err) => logger.error("Error shutting down SDK", err),
		)
		.finally(() => process.exit(0));
});
