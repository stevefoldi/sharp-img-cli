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
 * Resolve final config
 */
export async function resolveConfig(cliOptions = {}) {
    const userConfig = await loadUserConfig();
    const config = {
        ...defaultConfig,
        ...userConfig,
        ...cliOptions,
    };

    // Apply preset if provided
    if (config.preset) {
        const preset =
            userConfig.presets?.[config.preset] ||
            defaultConfig.presets?.[config.preset];

        if (!preset) {
            throw new Error(`Preset "${config.preset}" not found`);
        }

        Object.assign(config, preset);
    }

    config.variants = config.variants ?? [];

    return config;
}