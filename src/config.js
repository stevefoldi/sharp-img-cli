import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Default configuration
 */
const defaultConfig = {
    input: "./images",
    output: "./dist",
    sizes: [800],
    formats: ["webp"],
    quality: 80,
    dryRun: false,
};

/**
 * Load user config file if it exists
 */
async function loadUserConfig() {
    const configPath = path.resolve(process.cwd(), "imgtool.config.js");

    try {
        await fs.access(configPath);
        const module = await import(pathToFileURL(configPath));
        return module.default || {};
    } catch {
        return {};
    }
}

/**
 * Merge CLI options with config + defaults
 */
export async function resolveConfig(cliOptions = {}) {
    const userConfig = await loadUserConfig();

    return {
        ...defaultConfig,
        ...userConfig,
        ...cliOptions,
    };
}