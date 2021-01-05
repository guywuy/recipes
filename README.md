# Don't Worry Chicken Curry

Progressive Web App of collected recipes with changeable quantities.

## Live site

[https://dwcc.netlify.app/](https://dwcc.netlify.app/)

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

Update dependencies and the cssdb used by Browserslist and PostCSS:

```bash
# Update dependencies interactively
yarn update:deps

# Update the cssdb definitions. Run it every month.
yarn update:cssdb
```
