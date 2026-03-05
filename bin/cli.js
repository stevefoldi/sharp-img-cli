#!/usr/bin/env node

import { Command } from "commander";
import { resolveConfig } from "../src/config.js";
import { processImages } from "../src/processor.js";

const program = new Command();

program
    .name("imgtool")
    .description("Batch image processing CLI powered by Sharp")
    .version("1.1.0");

program
    .command("process [input] [output]")
    .description("Process images")
    .option("--variant <variant...>", "Resize variant (ex: 600x400:cover:top)")
    .option("--preset <preset>", "Use preset from config")
    .option("--dry-run", "Preview output without writing files")
    .action(async (input, output, options) => {
        try {
            const cliOptions = {
                input,
                output,
                variants: options.variant,
                preset: options.preset,
                dryRun: options.dryRun,
            };

            const config = await resolveConfig(cliOptions);

            await processImages(config);

        } catch (error) {
            console.error("Error:", error.message);
            process.exit(1);
        }
    });

program.parse();