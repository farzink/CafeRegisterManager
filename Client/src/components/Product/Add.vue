<template>  
  <div class="container border">
    <form class="p-4 was-validated">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
        <div class="invalid-feedback">
          Please choose a username.
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
  between,
  email
} from "vuelidate/lib/validators";
export default {
  name: "Add",  
  data() {
    return {
      name: "",      
      category: "",
      description: "",
      code: "",
      isAvailable: false,
      price: 0,      
      categories: [],
      selectedCategory: null,
      categoriesOptions: [],           
     
    };
  },
  validations: {
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
  },
  methods: {    
    conditioner: function(condition) {
      if (condition === "new") {
        this.isNew = true;
        this.isUsed = false;
      } else {
        this.isNew = false;
        this.isUsed = true;
      }
    },
    add: function() {
      this.ex = "busted";
      let that = this;
      if (!this.$v.invalid) {
        this.axios.defaults.headers.common["Authorization"] = this.$auth.FAH();
        console.log(this.price);
        this.axios
          .post(this.$gc.getBaseUrl("products"), {
            name: this.name,
            price: this.price,
            condition: this.isNew,
            categoryId: this.selectedCategory,
            description: this.description
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
      }
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
  .container {
    margin-top: 64px;
  }
</style>
