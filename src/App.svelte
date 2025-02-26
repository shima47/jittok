<script>
  import Router from "svelte-spa-router";
  import routes from "./routes";
    import Navigation from "./lib/components/Navigation.svelte";
</script>

<main>
  <Navigation />
  <Router {routes} />
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }
</style>
