#!/usr/bin/env node

import { Command } from "commander";
import { processImages } from "../src/processor.js";

const program = new Command();

program
    .name("imgtool")
    .description("Reusable Sharp Image Processing CLI")
    .version("1.0.0");

program
    .command("process <input> <output>")
    .option("-s, --sizes <sizes>", "Comma separated sizes", "800")
    .option("-f, --format <format>", "Output format (webp,avif,jpeg,png)", "webp")
    .action(async (input, output, options) => {
        const sizes = options.sizes.split(",").map(Number);

        await processImages({
            input,
            output,
            sizes,
            format: options.format,
        });
    });

program.parse();