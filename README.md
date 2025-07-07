# Don't Worry Chicken Curry

Progressive Web App of collected recipes with changeable quantities.

## Live site

[https://recipes.guywuy.com/](https://recipes.guywuy.com/)

### Running the local development mode

This command will run `parcel` and the local server (with [Browsersync][]) with auto reload.

```bash
npm run dev
```

### Building the production version

To generate your static site/blog you can run the following command. It will prepare the content assets and run optimisations for a production release.

```bash
npm run build
```

### More commands

Update the cssdb used by Browserslist and PostCSS:

```bash
# Update the cssdb definitions. Run it every month.
npm run update:cssdb
```
