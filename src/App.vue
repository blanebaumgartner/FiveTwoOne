<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <HelloWorld/> -->
    <Header/>
    <RestaurantList/>
    <Footer/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import Header from './components/Header'
import RestaurantList from './components/RestaurantList'
import Footer from './components/Footer'


export default {
  name: 'App',
  components: {
    // HelloWorld
    Header,
    RestaurantList,
    Footer
  }
}
</script>

<style>

</style>
