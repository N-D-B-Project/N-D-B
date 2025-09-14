import { Logger } from "@nestjs/common";
import { metrics } from "@opentelemetry/api";
import {
	getNodeAutoInstrumentations,
	getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
	ATTR_SERVICE_NAME,
	ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { setupNodeMetrics } from "@sesamecare-oss/opentelemetry-node-metrics";
import { name, version } from "../../package.json";

const logger = new Logger("OpenTelemetry");

const options = {
	url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
	compression: CompressionAlgorithm.GZIP,
};
const metricExporter = new OTLPMetricExporter(options);

const traceExporter = new OTLPTraceExporter(options);

const metricReader = new PeriodicExportingMetricReader({
	exporter: metricExporter,
	exportIntervalMillis: Number(process.env.OTEL_METRIC_EXPORT_INTERVAL),
	exportTimeoutMillis: Number(process.env.OTEL_METRIC_EXPORT_TIMEOUT),
});

const resource = resourceFromAttributes({
	[ATTR_SERVICE_NAME]: name.toUpperCase(),
	[ATTR_SERVICE_VERSION]: version,
});

const instrumentations = [
	getNodeAutoInstrumentations(),
	new PrismaInstrumentation(),
];

export const otelSDK = new NodeSDK({
	resource,
	metricReader,
	traceExporter,
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

process.on("beforeExit", () => {
	otelSDK
		.shutdown()
		.then(
			() => logger.verbose("SDK shut down successfully"),
			(err) => logger.error("Error shutting down SDK", err),
		)
		.finally(() => process.exit(0));
});
