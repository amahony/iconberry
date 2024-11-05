//@ts-nocheck
import * as fs from "node:fs";
import * as path from "path";
import { transform as svgrTransform } from "@svgr/core";
import lodash from "lodash";
import chalk from "chalk";

// Default configuration
import defaultConfig from "../../icon.config.js";

// Path to the user-defined configuration file
const userConfigPath = path.join(process.cwd(), "icon.config.js");

let iconconfig = defaultConfig;

// Check if user-defined configuration exists
if (fs.existsSync(userConfigPath)) {
    iconconfig = await import(userConfigPath);
}

const { source, output } = iconconfig; // Use the configuration

const sourceDir = path.join(process.cwd(), source); // Path to your SVG folder
const outputDir = path.join(process.cwd(), output); // Path to save TSX components

// Ensure the source and output directory exists
if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const defaultTemplate = (variables, { tpl }) => {
    return tpl`${variables.jsx}`;
};

fs.readdirSync(sourceDir).forEach(async (file) => {
    if (path.extname(file) === ".svg") {
        const svgPath = path.join(sourceDir, file);
        const svgContent = fs.readFileSync(svgPath, "utf-8");

        // Use svgrTransform with svgo plugins for correct className transformation
        const jsx = await svgrTransform(
            svgContent,
            {
                plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
                svgoConfig: {
                    plugins: [
                        {
                            name: "convertColors",
                            params: {
                                currentColor: true,
                                names2hex: true,
                                rgb2hex: true,
                                shorthex: true,
                                shortname: true,
                            },
                        },
                        {
                            name: "addClassesToSVGElement",
                            params: { className: "svgicon" },
                        },
                        {
                            name: "cleanupIds",
                            params: {
                                remove: true,
                            },
                        },
                        "removeTitle",
                        "convertStyleToAttrs",
                        "sortAttrs",
                        "removeEmptyAttrs",
                    ],
                },
                template: defaultTemplate,
                jsxRuntime: "automatic",
                prettier: true,
                svgProps: { width: "{width}", height: "{height}", color: "{color}" },
            },

            { componentName: "IconComponent" },
        );

        // Remove duplicate `React` import from the SVGR output

        const cleanJsx = jsx.replace(";", "").trim();
        const componentName = `Icon${lodash.upperFirst(lodash.camelCase(path.basename(file, ".svg")))}`;

        const tsxContent = `import * as React from 'react';

interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  color?: string;
  props?: { [key: string]: any };
}

export const ${componentName} = ({ width, height, color, ...props }: ${componentName}Props) => (
  ${cleanJsx}
)
`;
        fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), tsxContent, "utf-8");
        console.log(chalk.black.bgGreen(`Converted ${file} to ${componentName}.tsx`));
    }
});
