<template>  
  <div class="container border">
    <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
    <div class="row m-3">
      <h3>
        Add a New Product
      </h3>      
    </div>
    <form class="p-4">
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
      <div class="form-group row">
        <label for="productDescription" class="col-2 col-form-label text-right">&nbsp;</label>
        <div class="col-10">
          <input type="button" class="btn btn-primary float-right"  style="width: 8rem" @click="add" v-bind:class="{disabled: $v.$invalid}" value="Add">
        </div>
      </div> 
    </form>
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
  name: "Add",
  data() {
    return {
      product: {
        isAvailable: true
      },
      categories: [],
      selectedCategory: null,
      categoriesOptions: [],
      isLoading: false,
      html: '<img src="static/puff.svg" />'
    };
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
  },
  methods: {
    add: function() {
      if (this.selectedCategory !== null) {
        this.product.categoryId = this.selectedCategory;
      } else {
        this.$toasted.show("You need to select a category");
        return;
      }
      let that = this;
      this.axios.defaults.headers.common["Authorization"] = this.$auth.FAH();
      console.log(this.product);
      this.axios
        .post(this.$gc.getBaseUrl("items"), {
          name: this.product.name,
          price: parseFloat(this.product.price),          
          category_id: this.product.categoryId,
          description: this.product.description,
          code: this.product.code,
          isAvailable: this.product.isAvailable
        })
        .then(function(data) {
          if (data.status == 201) {
            that.$toasted.show("product successfully created.");
            that.$router.push("/manage/products");
          } else {
            that.$toasted.show("please try again!");
          }
        })
        .catch(function(error, data) {
          that.$toasted.show("plase try again later");
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
      var nullOption = { value: null, text: "Please Select a category" };
      this.categoriesOptions.push(nullOption);
      this.categories.forEach(cat => {
        this.categoriesOptions.push({ value: cat.id, text: cat.name });
      });
    }
  },
  mounted: function() {
    let those = this;
    var localCats = this.$gc.getItemByKey("categories");
    if (localCats !== null) {
      this.categories = localCats;
    } else {
      this.refreshCategories();
    }

    this.prepareCategories();
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
