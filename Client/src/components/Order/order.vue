<template>
  <div>
      <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
      <div class="order">      
        <div class="category border">
          <div class="cat-container">
            <div class="cat-row" v-for="(cat, index) in getLSMCategories()" :key="index">
                <input type="button" class="btn" :value="cat.name" :style="{backgroundColor: cat.color}" @click="filterByCategory(cat.id)">
            </div>            
          </div>
        </div>
        <div class="main border">
            <div class="container-fluid">
              <div class="row p-4">
                Total Price: {{totalPrice}}
              </div>
              <div class="row p-5">
          <label for="">Search</label>
          <input ref="searchBox" class="form-control float-right" type="text" @keyup="search()">
        </div>
              <div class="row p-4">
                <div v-for="(item, index) in currentItems" :key="index">
                  <input type="button" class="btn btn-secondary btn-item m-1 " :value="item.name" @click="addToOrder(item)">
                </div>
              </div>
            </div>
        </div>
        
        <div class="recipt border p-4">
          
            <div class="list-group m-2" v-for="(order, index) in orders" :key="index">
                <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                   <h5 class="mb-1" >{{order.item.name}}</h5>
                   <small class="h5" >x{{order.quantity}}</small>
                   </div>
                   <a @click="increaseQuantity(order, 1)" class="btn btn-success float-right text-light m-1 fa fa-plus"></a>
                   <a @click="increaseQuantity(order, -1)" class="btn btn-danger float-right text-light m-1 fa fa-minus"></a>
                   <br>
                  <small class="h5 text-muted">${{order.price}}</small>
              </a>
          
        </div>
        </div>
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
      items: this.$lsm.models.ITEMS,
      currentItems: [],
      orders: [],
      totalPrice: 0
    };
  },
  methods: {
    search(e){      
      this.currentItems = this.$lsm.get(this.items).filter(e=> e.code.includes(this.$refs.searchBox.value) || e.name.includes(this.$refs.searchBox.value)); 
    },
    increaseQuantity(order, quantity){      
      order.quantity+= + quantity;  
      order.price = order.quantity * order.item.price;    
      if(order.quantity < 1){
        var i = this.orders.find(e=> e.item.id == order.item.id);
        console.log(i);
        this.orders.splice(this.orders.indexOf(i), 1);
      }
      
        this.totalPrice += quantity * order.item.price;
      
    },    
    addToOrder(order){
      
      var i = this.orders.find(e=> e.item.id == order.id);      
      console.log(i);
      if(i != null){
        this.increaseQuantity(i, 1);
      }
      else
      {
      this.orders.push({quantity:1,
      price: order.price,
        item:order
        });
        this.totalPrice += order.price;
      }
      
    },
    filterByCategory(cat) {
      this.$refs.searchBox.value = "";
      this.currentItems = this.$lsm.get(this.items).filter(e=> e.category_id == cat);
    },
    p() {
      //   console.log(this.$lsm.get(this.categories));
      console.log(this.$lsm.get(this.items));
    },
    getLSMItems(cat = null) {
      console.log('inside', cat);
      if (cat === null) {
        return this.$lsm.get(this.items);
      } else {
        console.log('inside else');
        var a = this.$lsm.get(this.items).filter(e => e.category_id == cat.id);        
        console.log(a);
      }
    },
    getLSMCategories() {
      return this.$lsm.get(this.categories);
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
          self.$forceUpdate();
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
          self.$forceUpdate();
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
    }
  },
  mounted: function() {
    console.log("in before");
    this.$lsm.setDbName("ordersDb");
    this.$lsm.load();

    this.$lsm.clear(this.categories);
    this.getCategories();
    this.$lsm.clear(this.items);
    this.getItems();

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
.cat-container {
  position: absolute;
}
.cat-row {
  width: 150px;
  margin: 15px;
}

.cat-row input[type="button"] {
  border-radius: 70%;
  width: 110px;
  height: 110px;
}
.recipt {
  min-height: 100%;
  width: 300px;
  position: fixed;
  top: 56px;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.btn-item {
  /* border-radius: 70%; */
  width: 110px;
  height: 110px;
  margin: 1px;
}
.main {
  top: 56px;
  min-width: calc(100vw - 450px);
  margin-left: 150px;
  position: absolute;
}
</style>


