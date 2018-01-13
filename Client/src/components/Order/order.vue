<template>
  <div class="container-fluid" style="margin-top: 56px;">
   <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
   <div class="row">
      <div class="col-md-2 border" style="max-height: 94vh; overflow-y: auto; padding-left: 5px;">
         <div class="cat-row" v-for="(cat, index) in getLSMCategories()" :key="index">
            <input type="button" class="btn" :value="cat.name" :style="{borderColor: cat.color}" style="border:" @click="filterByCategory(cat.id)">
         </div>
      </div>
      <div class="col-md-7 border">
         <div class="container-fluid p-0">            
            <div class="row p-4">
              <div class="col-md-6 align-self-center">
                Order Number: {{orderNo}}
              </div>
              <div class="col-md-6">
               <div class="float-right">
                <input accesskey="n" type="button" @click="resetOrder" class="btn btn-round btn-warning text-light" value="New" />               
               </div>
              </div>
               
            </div>
            <div class="row p-2 form-group border border-left-0 border-right-0">
               <!-- <label class="col-form-label offset-sm-6 col-sm-2 text-right" for="">Search</label>
               <div class="col-sm-4">
                  <input ref="searchBox" class="form-control" type="text" @keyup="search()">
               </div> -->
               <div class="input-group  -3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">
                    <i class="fa fa-search"></i>
                  </span>
                </div>
                <input ref="searchBox" accesskey="s" @keyup="search()" type="text" class="form-control" placeholder="Search items" aria-label="Search">
              </div>
            </div>
            <div style="min-height: 500px;">
               <div class="row p-4">
                  <div class="div-item" v-for="(item, index) in currentItems" :key="index">
                     <!-- <input type="button" class="btn btn-secondary btn-item m-1" :style="{backgroundColor: getItemBg(item.category_id, index)}" :value="item.name" @click="addToOrder(item)">
                        <a href="#" class="badge badge-light">{{item.code}}</a> -->
                     <button type="button" class="btn btn-secondary btn-item m-1" :style="{backgroundColor: getItemBg(item.category_id, index)}" @click="addToOrder(item)">
                     {{item.name}}                    
                     </button>
                     <span style="top:10px; left:10px; position: absolute;min-width: 64px; max-width: 64px;" href="#" class="badge badge-secondary">{{item.code}}</span>
                  </div>
                  <span v-if="currentItems.length < 1">no items</span>
               </div>
            </div>
            <div class="row p-4 float-right border border-warning border-right-0 border-bottom-0">
               <span style="width: 20rem" class="h4 float-left">Total Price: {{totalPrice | currency}}</span>
            </div>
         </div>
      </div>
      <div class="col-md-3 border p-4">
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
      totalPrice: 0,
      orderNo: ""
    };
  },
  methods: {
    getItemBg(categoryId, index) {
      var i = this.$lsm.get(this.categories).find(e => e.id == categoryId)
        .color;
      var color = i.split("#")[1];
      var finalColor = "";
      if (color.length == 3) {
        var vc = parseInt(color[2], 16);
        finalColor = color[0] + color[1] + (vc + index * 5).toString(16);
      } else {
        var vc = parseInt(color[4] + color[5], 16);
        finalColor =
          color[0] +
          color[1] +
          color[2] +
          color[3] +
          (vc + index * 5).toString(16);
      }
      // var c = parseInt(color, 16);
      // var b= (c + (index * 5)).toString(16);

      return "#" + finalColor;
    },
    resetOrder() {
      this.orderNo = Date.now()
        .toString(36)
        .toUpperCase();
      this.orders = [];
      this.totalPrice = 0;
    },
    search(e) {
      if (this.$refs.searchBox.value != "") {
        this.currentItems = this.$lsm
          .get(this.items)
          .filter(
            e =>
              e.code
                .toLowerCase()
                .includes(this.$refs.searchBox.value.toLowerCase()) ||
              e.name
                .toLowerCase()
                .includes(this.$refs.searchBox.value.toLowerCase())
          );
      } else {
        this.currentItems = this.$lsm.get(this.items);
      }
    },
    increaseQuantity(order, quantity) {
      order.quantity += +quantity;
      order.price = order.quantity * order.item.price;
      if (order.quantity < 1) {
        var i = this.orders.find(e => e.item.id == order.item.id);
        console.log(i);
        this.orders.splice(this.orders.indexOf(i), 1);
      }

      this.totalPrice += quantity * order.item.price;
    },
    addToOrder(order) {
      var i = this.orders.find(e => e.item.id == order.id);
      console.log(i);
      if (i != null) {
        this.increaseQuantity(i, 1);
      } else {
        this.orders.push({
          quantity: 1,
          price: order.price,
          item: order
        });
        this.totalPrice += order.price;
      }
    },
    filterByCategory(cat) {
      this.$refs.searchBox.value = "";
      this.currentItems = this.$lsm
        .get(this.items)
        .filter(e => e.category_id == cat);
    },
    p() {
      //   console.log(this.$lsm.get(this.categories));
      console.log(this.$lsm.get(this.items));
    },
    getLSMItems(cat = null) {
      console.log("inside", cat);
      if (cat === null) {
        return this.$lsm.get(this.items);
      } else {
        console.log("inside else");
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

    if (this.orderNo == "")
      this.orderNo = Date.now()
        .toString(36)
        .toUpperCase();

    this.currentItems = this.$lsm.get(this.items);

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
  /* width: 150px; */
  display: inline-block;
  margin: 5px 5px;
}

.cat-row input[type="button"] {
  border-radius: 70%;
  width: 85px;
  height: 85px;  
  font-size: 14px;
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
.div-item {
  /* border-radius: 70%; */
  min-width: 110px;
  min-height: 110px;
  position: relative;
  max-width: 110px;
  max-height: 110px;
  margin: 1px;
}

.btn-item {
  /* border-radius: 70%; */
  min-width: 110px;
  min-height: 110px;  
  max-width: 110px;
  max-height: 110px;
  margin: 1px;
}

.main {
  top: 56px;
  min-width: calc(100vw - 450px);
  margin-left: 150px;
  position: absolute;
}
.container-fluid {
  background: url("/static/img/bg.jpg") no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 93vh;
}
</style>


