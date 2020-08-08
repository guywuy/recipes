# Don't Worry Chicken Curry

Forked from [XITY](https://github.com/equinusocio/xity-starter)

## Prerequisites

- [Node.js][] & npm
- [Yarn][]

## Usage

You can download the scaffolding to create a new project structure with one command:

```bash
npx degit equinusocio/xity-starter
```

This command will download the project to your current working directory and remove the `.github` and `.vscode` folders. After the project structure has been downloaded, you should install the required dependencies:

```bash
yarn install
```

### Running the local development mode

This command will run `parcel` and the local server (with [Browsersync][]) with auto reload.

```bash
yarn dev
```

### Building the production version

To generate your static site/blog you can run the following command. It will prepare the content assets and run optimisations for a production release.

```bash
yarn build
```

### More commands

XITY provides also two more commands useful to update dependencies and the cssdb used by Browserslist and PostCSS:

```bash
# Update dependencies interactively
yarn update:deps

# Update the cssdb definitions. Run it every month.
yarn update:cssdb
```

## Configurations

You can easily configure your site by changing the settings inside `src/_data/config.json`.

Here are the default settings you will get with this project structure:

```js
{
  // Site name used as default site title
  "name": "Eleventy blog/site starter",

  // Short description used as default page description
  "shortDesc": "A starting point to make blogs and sites. It’s not a template.",

  // Default document language
  "lang": "en",

  // The default website base url
  "url": "localhost",

  // Social shares author username
  "authorHandle": "@equinusocio",

  // Social shares author name
  "authorName": "Mattia Astorino",

  // Tip payment url, if you want to monetize your site
  "paymentPointer": "$twitter.xrptipbot.com/equinusocio",

  // Code highlight theme, must reflect the file name inside /assets/css.
  // Remove to disable it
  "syntaxTheme": "prism-material-light.css",

  // CSS classes applied to the "#" anchor elements inside headings
  "permalinkClass": ["permalink"],

  // CSS classes applied to the iframes wrapper
  "iframesClass": ["iframes-wrapper"],

  // CSS classes applied to highlighted code snippets
  "codeClass": ["code-wrapper"],

  // Filesystem folders. "blogdir" and "includes" must be relative to "src"
  "paths": {
    "src": "src",
    "blogdir": "blog",
    "includes": "components",
    "output": "dist"
  }
}
```
