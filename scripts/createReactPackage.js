"use strict";

const lodash = require("lodash");
const transform = require("babel-core").transform;

// Transform code to ES5
const getTransformedSourceCode = originalSource =>
  transform(originalSource, {
    presets: ["babel-preset-env", "babel-preset-react"]
  }).code;

// Get the contents of the optimized SVG
// by trimming leading and tailing <svg> tags
const getSVGContent = source =>
  source.slice(source.indexOf(">") + 1).slice(0, -6);

/**
 * Template: React components
 */
const getReactSource = ({ componentName, height, width, svgPaths }) =>
  getTransformedSourceCode(`
import React from 'react';
import createIconComponent from './utils/createIconComponent';
const ${componentName} = createIconComponent({ content: <g>${svgPaths}</g>, height: ${height}, width: ${width} });
${componentName}.displayName = '${componentName}';
export default ${componentName};
`);

/**
 * Template: createIconComponent
 */

const getCreateIconSource = () =>
  getTransformedSourceCode(`
import React from 'react';
const createIconComponent = ({ content, height, width }) => (props) =>  React.createElement('svg', {
         style: {fill: props.fill || 'currentColor'},
         viewBox: \`0 0 \${width} \${height}\`,
         width: \`\${props.width || width}\`,
         height: \`\${props.height || height}\`
       },
       content);

export default createIconComponent;
`);

/**
 * Template: package.json
 */
const getPackageJsonSource = ({ version }) => `{
  "name": "iconberry",
  "version": "${version}",
  "dependencies": {
    "react": ">=16.2.0"
  }
}`;

const createReactPackage = (svgs, version) => {
  const files = svgs.map(svg => {
    const { name, width, height } = svg.metadata;
    const componentName = `Icon${lodash.upperFirst(lodash.camelCase(name))}`;
    const svgPaths = getSVGContent(svg.source);
    // console.log(svgPaths);
    const source = getReactSource({
      componentName,
      width,
      height,
      svgPaths
    });
    const filepath = `${name}.js`;

    return { filepath, source };
  });

  files.push({
    filepath: "utils/createIconComponent.js",
    source: getCreateIconSource()
  });

  files.push({
    filepath: "package.json",
    source: getPackageJsonSource({ version })
  });

  return {
    name: "iconberry",
    files
  };
};

module.exports = createReactPackage;
