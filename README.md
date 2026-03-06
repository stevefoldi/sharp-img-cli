# sharp-img-cli

A fast and flexible **Node.js CLI for batch image processing** powered by **Sharp**.

Resize, crop, and convert large sets of images using configurable variants, presets, and parallel processing.

Perfect for:

* Web developers optimizing images for websites
* Pre-processing assets for React, WordPress, or static sites
* Batch resizing large folders of images

---

# Features

* Batch image processing
* Multiple resize variants in a single command
* Crop control (`top`, `center`, etc.)
* Recursive directory scanning
* Parallel processing for speed
* Optional project configuration file
* Custom presets
* Web-ready output (WebP, JPEG, PNG)

---

# Installation

Clone the repository:

```bash
git clone git@github.com:stevefoldi/sharp-img-cli.git
cd sharp-img-cli
```

Install dependencies:

```bash
npm install
```

Link the CLI globally:

```bash
npm link
```

Verify installation:

```bash
imgtool --help
```

---

# Basic Usage

Process a folder of images:

```bash
imgtool process ./images ./dist
```

---

# Resize Variants

Generate multiple versions of each image.

Example:

```bash
imgtool process ./images ./dist \
  --variant 600x400:cover:top \
  --variant 1000x
```

This creates:

| Variant             | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `600x400:cover:top` | Resize width to 600px and crop height to 400px from the top |
| `1000x`             | Resize width to 1000px while maintaining aspect ratio       |

---

# Using Presets

Presets allow you to reuse common resize configurations.

Example:

```bash
imgtool process ./images ./dist --preset blog
```

Example preset definition:

```javascript
export const presets = {
  blog: [
    { width: 600, height: 400, fit: "cover", position: "top" },
    { width: 1000 }
  ]
};
```

---

# Project Configuration

You can place an optional configuration file in any project.

```
imgtool.config.js
```

Example configuration:

```javascript
export default {
  input: "./images",
  output: "./dist",
  formats: ["webp"],
  quality: 80,
  recursive: true
};
```

Now you can simply run:

```bash
imgtool process
```

---

# Example Workflow

Typical project structure:

```
project/
  images/
  dist/
  imgtool.config.js
```

Run the CLI:

```bash
imgtool process
```

Images will automatically be processed into `/dist`.

---

# Example Output

```
dist/
  image-600x400.webp
  image-1000.webp
  photo-600x400.webp
  photo-1000.webp
```

---

# Development

Run the CLI without linking globally:

```bash
node bin/cli.js process ./images ./dist
```

---

# Tech Stack

* Node.js
* Sharp
* Commander
* Glob

---

# License

MIT License
