<template> 
  <div class="container border">
    <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
    <div class="row m-3">
      <h3>
        View/Edit/Delete items
      </h3>      
    </div>
    <div v-if="products.length > 0" class="row">      
      <div v-for="item in products" class="card m-3" v-bind:key="item.id" style="width: 20rem;">    
        <h3 class="card-header">{{item.code}}</h3>
          <div class="card-block p-4">           
            <h4 class="card-title">{{item.name}}</h4>
            <p class="card-text">{{item.description.slice(0, 100) + "..."}}</p>            
            <b-button v-b-tooltip.hover title="Edit this Item" @click="editItem(item)" class="btn btn-outline-success float-right">Edit
            </b-button>                                     
            <b-button style="position: absolute; top:10px; right: 10px" v-b-tooltip.hover title="Delete this Item" @click="deleteItem(item)" class="btn btn-sm btn-outline-danger float-right fa fa-close">
            </b-button>   
          </div>  
        </div>
    </div>
    <div class="row" v-else>
      <span>
          There are no items yet! Start by adding 
      </span>
      <router-link class="btn btn-sm btn-primary" :to="'/manage/products/add'">
          a new Item
      </router-link>   
    </div>
    <b-modal id="confirmationModal"
                centered 
                hide-footer
                size="sm"
                ref="confirmationModal"                
                header-bg-variant="danger"
                title="Are you sure?">
            <div class="d-block text-center">
                <h3>You are about to delete this item. press delete button to proceed!</h3>
            </div>
            <b-btn class="mt-3" variant="danger" block @click="doDelete">Delete</b-btn>
    </b-modal>
    <b-modal id="EditModal"
                centered   
                hide-footer             
                size="lg"
                ref="editModal"                                
                title="Edit Item">
            <div class="d-block text-center">
              <form>
                <div class="form-group row">
                  <label for="productName" class="col-2 col-form-label text-right">Name</label>
                  <div class="col-10">
                    <input class="form-control" type="text" placeholder="Name" id="productName" v-model="product.name">
                    <small class="form-text text-danger" v-if="!$v.product.name.required && $v.product.name.$dirty">Name is required</small>  
                    <small class="form-text text-danger" v-if="!$v.product.name.maxLength ">Name can not be longer than 40 characters</small>          
                  </div>
                </div>
                <div class="form-group row">
                  <label for="productPrice" class="col-2 col-form-label text-right">Price</label>
                  <div class="col-10">
                    <input class="form-control" type="number" placeholder="Price" id="productPrice" v-model="product.price">
                    <small class="form-text text-danger" v-if="!$v.product.price.required && $v.product.price.$dirty">Price is required</small>          
                    <small class="form-text text-danger" v-if="!$v.product.price.between">Price should be between 0 and 99999999</small>                    
                  </div>
                </div>
                <div class="form-group row">
                  <label for="productCategory" class="col-2 col-form-label text-right">Category</label>
                  <div class="col-10">
                    <b-form-select id="productCategory"
                                  :options="categoriesOptions"
                                  required
                                  v-model="selectedCategory">
                    </b-form-select>
                  </div>
                </div> 
                <div class="form-group row">
                  <label for="productCode" class="col-2 col-form-label text-right">Code</label>
                  <div class="col-10">
                    <input class="form-control" type="text" placeholder="Code" id="productCode" v-model="product.code">          
                  </div>
                </div>
                <div class="form-group row">
                  <label for="productDescription" class="col-2 col-form-label text-right">Description</label>
                  <div class="col-10">
                    <textarea class="form-control" type="text" placeholder="Description" id="productDescription" rows="3" v-model="product.description"></textarea>
                    <small class="form-text text-danger" v-if="!$v.product.description.required && $v.product.description.$dirty">Description is required</small>  
                    <small class="form-text text-danger" v-if="!$v.product.description.maxLength ">Description can not be longer than 1000 characters</small>  
                  </div>
                </div> 
                <div class="form-group row">
                  <label for="productAvailability" class="col-2 col-form-label text-right">&nbsp;</label>
                  <div class="col-10">
                    <div class="form-check">
                      <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" v-model="product.isAvailable" value="">
                        is this item Available?
                      </label>
                    </div>
                  </div>
                </div>                                        
                <b-button class="btn-block" v-bind:class="{disabled: $v.$invalid}" type="button" @click="doEditItem" variant="primary">Save</b-button>                    
              </form>
            </div>            
    </b-modal>
    <router-link class="btn btn-danger btn-round fa fa-arrow-left"
            style="position:fixed; top:64px; right: 10px; color: white" :to="'/manage/products'">
    </router-link>   
  </div>  
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
export default {
  name: "Index",
  data() {
    return {
      products: [],
      isLoading: false,
      html: '<img src="static/puff.svg" />',
      product: {},
      categories: [],
      itemToDelete: {},
      selectedCategory: null,
      categoriesOptions: []
    };
  },
  methods: {
    editItem(item) {
      this.product = item;
      this.selectedCategory = item.category_id;
      this.$refs.editModal.show();
    },
    doEditItem() {
      this.isLoading = true;
      var self = this;
      this.axios.defaults.headers.common["Authorization"] = this.$auth.FAH();
      var path = this.$gc.getBaseUrl("items/" + this.product.id);
      this.axios
        .put(path, {
          name: this.product.name,
          price: parseFloat(this.product.price),
          category_id: this.product.categoryId,
          description: this.product.description,
          code: this.product.code,
          isAvailable: this.product.isAvailable
        })
        .then(function(data) {
          self.$toasted.show("Item successfully Updated.");
          self.$refs.editModal.hide();
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
      this.product = {};
    },
    deleteItem(item) {
      this.itemToDelete = item;
      this.$refs.confirmationModal.show();
    },
    doDelete() {
      this.isLoading = true;
      var self = this;
      var path = this.$gc.getBaseUrl("items/" + this.itemToDelete.id);
      this.axios
        .delete(path, { headers: this.$auth.AH() })
        .then(function(data) {
          var p = self.products.find(e => e.id == self.itemToDelete.id);
          var index = self.products.indexOf(p);
          if (index !== -1) {
            self.products.splice(index, 1);
          }
          self.$toasted.show("Item successfully Deleted.");
          self.$refs.confirmationModal.hide();
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
    },
    refreshCategories() {
      this.isLoading = true;
      let self = this;
      this.axios
        .get(this.$gc.getBaseUrl("categories"), { headers: this.$auth.AH() })
        .then(function(data) {
          self.$gc.saveItemByKey(
            "categories",
            JSON.stringify(data.data.categories)
          );
          self.categories = data.data.categories;
          self.$toasted.show("Categories are up to date.");
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
    },
    prepareCategories() {
      this.categories.forEach(cat => {
        this.categoriesOptions.push({ value: cat.id, text: cat.name });
      });
    }
  },
  beforeMount: function() {
    let that = this;
    var localCats = this.$gc.getItemByKey("categories");
    if (localCats !== null) {
      this.categories = localCats;
    } else {
      this.refreshCategories();
    }
    this.axios
      .get(this.$gc.getBaseUrl("items"), { headers: this.$auth.AH() })
      .then(function(data) {
        that.products = data.data.items;
      })
      .catch(function(error) {
        console.log(error);
      });
    this.prepareCategories();
  },
  validations: {
    product: {
      name: {
        required,
        maxLength: maxLength(40)
      },
      description: {
        required,
        maxLength: maxLength(1000)
      },
      price: {
        required,
        between: between(0, 99999999)
      }
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
