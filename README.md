# Iconberry

Iconberry is a tool to convert SVG icons to React components. It allows you to specify input and output directories for your SVG files and generates TypeScript React components from them.

## Installation

To install Iconberry, run the following command:

```sh
npm install iconberry
```

## Configuration

Iconberry uses a configuration file named `icon.config.js` to specify the input and output directories for your SVG files. By default, the configuration file looks like this:

```js
// icon.config.js
const iconconfig = {
    source: "public/icons",
    output: "src/components/icons",
};

module.exports = iconconfig;
```

When you install Iconberry, a default `icon.config.js` file will be created in the root directory of your project if it doesn't already exist. You can customize this file to specify your own input and output directories.

## Usage

1. **Place your SVG files** in the directory specified by the `source` field in `icon.config.js`. By default, this is `public/icons`.

2. **Run the build script** to convert the SVG files to React components:

```sh
npm run build
```

3. **Find the generated components** in the directory specified by the `output` field in `icon.config.js`. By default, this is `src/components/icons`.

## Example

Here is an example of how to use Iconberry:

1. **Install Iconberry**:

```sh
npm install iconberry
```

2. **Customize the configuration** (optional):

Edit the `icon.config.js` file in the root directory of your project to specify your own input and output directories:

```js
// icon.config.js
const iconconfig = {
    source: "assets/svg-icons",
    output: "components/svg-icons",
};

module.exports = iconconfig;
```

3. **Place your SVG files** in the `assets/svg-icons` directory.

4. **Run the build script**:

```sh
npm run build
```

5. **Find the generated components** in the `components/svg-icons` directory.

## License

This project is licensed under the ISC License.
