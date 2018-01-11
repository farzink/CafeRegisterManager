<template>
  <div>
      <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
      <div class="order">      
        <div class="category border">
          <div class="cat-container">
            <div class="cat-row" v-for="(cat, index) in $lsm.get(categories)" :key="index">
                <input type="button" class="btn btn-info" :value="cat.name" @click="filterByCategory(cat)">
            </div>            
          </div>
        </div>
        <div class="main border">
            salam
        </div>
        <input type="button" @click="p" value="abbas" />
      </div>
  </div>
</template>
<script>
export default {
  name: "IndexCategory",
  data() {
    return {
      isLoading: false,
      html: '<img src="static/puff.svg" />',
      categories: this.$lsm.models.CATEGORIES,
      items: this.$lsm.models.ITEMS
    };
  },
  methods: {
    filterByCategory(cat){
      alert(cat.id)
    },
    p() {
      //   console.log(this.$lsm.get(this.categories));
      console.log(this.$lsm.get(this.items).find(e => e.category_id == 26));
    },
    getCategories() {
      this.isLoading = true;
      let self = this;
      this.axios
        .get(this.$gc.getBaseUrl("categories"), { headers: this.$auth.AH() })
        .then(function(data) {
          self.$lsm.set(data.data.categories, self.categories);
          self.$lsm.save();
          //   self.categories = data.data.categories;
          self.$toasted.show("Categories are up to date.");
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
    },
    getItems() {
      this.isLoading = true;
      let self = this;
      this.axios
        .get(this.$gc.getBaseUrl("items"), { headers: this.$auth.AH() })
        .then(function(data) {
          self.$lsm.set(data.data.items, self.items);
          self.$lsm.save();
          //   that.products = data.data.items;
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
    }
  },
  beforeMount: function() {
    this.$lsm.setDbName("ordersDb");
    this.$lsm.load();

    // this.$lsm.clear(this.categories);
    // this.getCategories();
    // this.$lsm.clear(this.items);
    // this.getItems();

    //this.$lsm.set({id: 1, name: "c"}, items)
    //this.$lsm.clear(e);
    //this.$lsm.save()
    //this.$lsm.update({id: 2, name: "na gholam"}, e)
    // this.$lsm.remove({ id: 2, name: "na gholam" }, e);

    //console.log(this.$lsm.get(categories));

    // var localCats = this.$gc.getItemByKey("categories");
    // if (localCats !== null) {
    //   this.categories = localCats;
    // } else {
    //   this.getCategories();
    // }
  }
};
</script>
<style lang="css" scoped>
.category {
  min-height: 100%;  
  width: 150px;
  position: fixed;
  top: 56px;
  left: 0;  
  overflow-y: auto;
  overflow-x: hidden;
}
.cat-container{
  position: absolute;  
}
.cat-row {
  width: 150px;
  margin: 15px;

}

.cat-row input[type="button"] {
  border-radius: 70%;
  width: 110px;
  height: 110px;;
}
.main {  
  top: 56px;
  min-width: calc(100vw - 150px);
  margin-left: 150px;  
  position: absolute;     
}
</style>


