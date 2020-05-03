This repo, hosted on Github Pages, serves all three embedded visualizations on [Exploring the Complexity of COVID-19 Diagnostic Tests](https://interventions.centerofci.org/pub/exploring-covid-test-complexity/release/1) and [COVID-19 RNA Testing Technology Assessment](https://interventions.centerofci.org/pub/covid-testing-assessment/release/14)

---

The base is the default [Svelte](https://svelte.dev/) starter.

## Get started

Install the dependencies...

```bash
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Building production mode and deploying

To create an optimised version of the app:

```bash
npm run build
```

This will build the final bundle and replace the contents of the /docs folder.

If you want to test the production build locally, run a static server from the /docs folder.

To deploy, commit and push your changes.

Github Pages should update with a 2-20 minute delay.
