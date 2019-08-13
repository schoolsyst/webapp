<template>
  <main>
    <link v-for="fontPath in fonts" :key="fontPath" rel="stylesheet" :href="fontPath">
    <Navbar currentPage="dashboard"/>
    <nuxt />
  </main>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
export default {
  components: {
    Navbar
  },

  data() { return {
    fonts: [
      '/fonts/Manrope/index.css',
      'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined'
    ]
  }}
}
</script>


<style>
:root {
  --material-blue: #1389FD;
  --offset-blue: #E7F8FF;
}

li {
  list-style: none;
}

* {
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
}

ul, h1, h2, h3, h4, h5, h6, p, li {
    margin: 0;
    padding: 0;
}

h2 {
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 4px;
  margin-top: 20px;
}

@media (min-width: 1000px) {
  main {
    margin: 30px 0 0 30px;
  }

  .horizontal-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
