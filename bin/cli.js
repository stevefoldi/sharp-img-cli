#!/usr/bin/env node

import { Command } from "commander";
import { resolveConfig } from "../src/config.js";
import { processImages } from "../src/processor.js";

const program = new Command();

program
    .name("imgtool")
    .description("Reusable Sharp Image Processing CLI")
    .version("1.0.0");

program
    .command("process [input] [output]")
    .option("-s, --sizes <sizes>", "Comma separated sizes (e.g. 400,800,1200)")
    .option("-f, --formats <formats>", "Comma separated formats (webp,avif,jpeg,png)")
    .option("-q, --quality <quality>", "Image quality (default 80)")
    .option("--dry-run", "Preview changes without writing files")
    .action(async (input, output, options) => {
    const cliOptions = {
            input,
            output,
            sizes: options.sizes
                ? options.sizes.split(",").map(Number)
                : undefined,
            formats: options.formats
                ? options.formats.split(",")
                : undefined,
            quality: options.quality ? Number(options.quality) : undefined,
            dryRun: options.dryRun || false,
        };

        const config = await resolveConfig(cliOptions);
        await processImages(config);
    });

program.parse();