import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { glob } from "glob";
import cliProgress from "cli-progress";

/**
 * Parse variant string
 */
function parseVariant(str) {
	const [size, fit = "cover", position = "center"] = str.split(":");
	const [width, height] = size.split("x").map(Number);

	return {
		width: width || null,
		height: height || null,
		fit,
		position,
	};
}

async function processSingleImage(file, config, variantList, stats) {
	const { input, output, formats, quality, dryRun } = config;
	const relativePath = path.relative(input, file);
	const dir = path.dirname(relativePath);
	const ext = path.extname(file);
	const name = path.basename(file, ext);

	for (const variant of variantList) {
		for (const format of formats) {
			const width = variant.width;
			const height = variant.height;
			const outputDir = path.join(output, dir);
			const sizeSuffix = !config.noResize && (width || height) ? `-${width || ""}x${height || ""}` : "";
			const outputName = `${name}${sizeSuffix}.${format}`;
			const outputPath = path.join(outputDir, outputName);

			if (dryRun) {
				console.log("DRY RUN:", outputPath);
				continue;
			}

			await fs.mkdir(outputDir, { recursive: true });

			let image = sharp(file);

			// Apply resize only if variant exists AND not in noResize mode
			if (config.noResize) {
				// Do nothing — keep original dimensions
				//console.log("noResize:", config.noResize);
			} else if (variant && (variant.width || variant.height)) {
				image = image.resize({
					width: variant.width,
					height: variant.height,
					fit: variant.fit,
					position: variant.position,
				});
			}

			if (!config.force) {
				// Skip if file already exists
				try {
					await fs.access(outputPath);
					stats.skipped++;
					return;
				} catch {
					// file does not exist → continue
				}
			}

			await image.toFormat(format, { quality }).toFile(outputPath);
			stats.processed++;

			//console.log("✓", outputPath);
		}
	}
}

export async function processImages(config) {
	const { input, variants, recursive, concurrency } = config;

	const pattern = recursive ? `${input}/**/*.{jpg,jpeg,png,webp}` : `${input}/*.{jpg,jpeg,png,webp}`;

	const files = await glob(pattern);

	let processedCount = 0;
	let skippedCount = 0;

	if (files.length === 0) {
		console.log("No images found.");
		return;
	}

	const variantList = variants.filter((v) => v !== null).map(parseVariant);

	// If no-resize → manually inject empty variant
	if (variantList.length === 0) {
		variantList.push({
			width: null,
			height: null,
			fit: "cover",
			position: "center",
		});
	}

	const queue = [...files];

	const bar = new cliProgress.SingleBar(
		{
			format: "Processing [{bar}] {percentage}% | {value}/{total} | {file}",
		},
		cliProgress.Presets.shades_classic,
	);

	bar.start(files.length, 0);

	const stats = {
		processed: 0,
		skipped: 0,
	};

	const workers = Array(concurrency)
		.fill(null)
		.map(async () => {
			while (queue.length > 0) {
				const file = queue.shift();
				if (!file) break;

				await processSingleImage(file, config, variantList, stats);
				bar.increment({
					file: `${path.basename(file)} (${stats.processed}✓ ${stats.skipped}↺)`,
				});
			}
		});

	await Promise.all(workers);

	bar.stop();

	if (config.force) {
		console.log("\n⚠ Force mode enabled (no skipping)");
	}

	console.log(`\n✔ Processed: ${stats.processed}`);
	console.log(`✔ Skipped: ${stats.skipped}`);
}
