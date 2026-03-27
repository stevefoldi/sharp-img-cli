#!/usr/bin/env node

import { Command } from "commander";
import { resolveConfig } from "../src/config.js";
import { processImages } from "../src/processor.js";

const program = new Command();

program.name("imgtool").description("Batch image processing CLI powered by Sharp").version("1.2.0");

program
	.command("process [input] [output]")
	.description("Process images")
	.option("-v, --variant <variant...>", "Resize variant (e.g. 600x400:cover:top)")
	.option("-p, --preset <preset>", "Use preset from config")
	.option("-f, --format <format...>", "Output format(s) (webp, png, jpeg)")
	.option("-q, --quality <number>", "Image quality (default: 80)", parseInt)
	.option("-c, --concurrency <number>", "Number of parallel jobs (default: 5)", parseInt)
	.option("--dry-run", "Preview output without writing files")
	.option("--no-recursive", "Disable recursive directory processing")
	.option("--no-resize", "Disable resizing (compress/convert only)")
	.option("--force", "Reprocess all images (ignore existing output)")
	.action(async (input, output, options) => {
		try {
			const cliOptions = {
				input,
				output,
				variants: options.variant,
				preset: options.preset,
				formats: options.format,
				quality: options.quality,
				concurrency: options.concurrency,
				recursive: options.recursive,
				dryRun: options.dryRun,
				noResize: options.resize === false,
				force: options.force,
			};

			const config = await resolveConfig(cliOptions);

			await processImages(config);
		} catch (error) {
			console.error("Error:", error.message);
			process.exit(1);
		}
	});

program.parse();
