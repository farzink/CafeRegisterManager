<template>
  <!-- <div class="row justify-content-center parent">
    <div class="card m-5 p-2 subparent" style="width: 60rem;">
      <div class="card-body">
      <h4 class="card-title">Manage Products</h4>
      <h6 class="card-subtitle mb-4 text-muted "></h6>
      <div class="row"> 
        <div v-for="product in products" class="card p-4 m-3" v-bind:key="product.id" style="width: 17rem;">    
          <div class="card-block">
            <h4 class="card-title">{{product.name}}</h4>
            <p class="card-text">{{product.description.slice(0, 100) + "..."}}</p>
            <router-link class="btn btn btn-secondary rounded text-light float-right" :to="'/manage/products/edit/' + product.id">Edit</router-link>                    
          </div>  
        </div>
      </div>
      <router-link class="btn btn-danger btn-round fa fa-close" style="position:absolute; top:10px; right: 10px; color: white" :to="'/manage/products'"></router-link>      
      </div>
    </div>
  </div> -->
  <div class="container border">
    <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
    <div class="row m-3">
      <h3>
        View/Edit/Delete items
      </h3>      
    </div>
    <div class="row">
      <div v-for="product in products" class="card p-4 m-3" v-bind:key="product.id" style="width: 20rem;">    
          <div class="card-block">
            <h4 class="card-title">{{product.name}}</h4>
            <p class="card-text">{{product.description.slice(0, 100) + "..."}}</p>
            <router-link class="btn btn btn-secondary rounded text-light float-right" :to="'/manage/products/edit/' + product.id">Edit</router-link>                    
          </div>  
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      products: []
    };
  },
  methods: {   
  },
  beforeMount: function() {
    let that = this;
    this.axios
      .get(this.$gc.getBaseUrl("items"), { headers: this.$auth.AH() })
      .then(function(data) {
        console.log(data.data);
        that.products = data.data.items;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
