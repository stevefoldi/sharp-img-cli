import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Default configuration
 */
const defaultConfig = {
    input: "./images",
    output: "./dist",
    variants: [],
    formats: ["webp"],
    quality: 80,
    dryRun: false,

    presets: {
        thumbnail: {
            variants: ["600x400:cover:top"],
        },

        large: {
            variants: ["1000x"],
        },

        blog: {
            variants: ["600x400:cover:top", "1000x"],
        },
    },
};

/**
 * Load optional project config
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
 * Merge config layers
 */
export async function resolveConfig(cliOptions = {}) {
    const userConfig = await loadUserConfig();

    const config = {
        ...defaultConfig,
        ...userConfig,
        ...cliOptions,
    };

    // Apply preset if provided
    if (merged.preset) {
        const presetConfig =
            userConfig.presets?.[merged.preset] ||
            defaultConfig.presets?.[merged.preset];

        if (!presetConfig) {
            throw new Error(`Preset "${merged.preset}" not found`);
        }

        Object.assign(merged, presetConfig);
    }

    merged.variants = merged.variants ?? [];

    return merged;
}