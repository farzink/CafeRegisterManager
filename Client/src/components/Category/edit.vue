<template>
    <div class="row justify-content-center parent">
        <div class="card m-5 p-2" style="width: 60rem;">
            <div class="card-body">
                <h4 class="card-title">List of Categoreis</h4>
                <h6 class="card-subtitle mb-4 text-muted ">You can view all the categories here</h6>
                <form>
                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Name</label>
                        <div class="col-sm-8">
                            <input class="form-control" id="inputEmail3" placeholder="Name" v-model="name" @input="$v.name.$touch()">      
                            <span class="text-danger" v-if="!$v.name.required && $v.name.$dirty">name is required</span>
                            <span class="text-danger" v-if="!$v.name.maxLength">name can not be longer than 40 characters</span>
                        </div>    
                    </div>
                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Price</label>
                        <div class="col-sm-8">
                            <input class="form-control" id="inputEmail3" placeholder="Name" v-model="price" @input="$v.price.$touch()">      
                            <span class="text-danger" v-if="!$v.price.required && $v.price.$dirty">price is required</span>      
                            <span class="text-danger" v-if="!$v.price.between">price should be between 0 and 99999999</span>     
                        </div>    
                    </div>

                    <div class="form-group row">
                        <label for="inputPassword3" class="col-sm-3 col-form-label">Condition</label>
                        <div class="col-sm-8">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn" v-bind:class="[ isNew ? 'btn-success' : 'btn-secondary'  ]"  @click="conditioner('new')">New</button>
                                <button type="button" class="btn" v-bind:class="[ isUsed ? 'btn-success' : 'btn-secondary' ]" @click="conditioner('used')">Used</button>  
                            </div>
                        </div>
                    </div> 

                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Category</label>
                        <div class="col-sm-8">
                            <select class="col-4 col-md-3 form-control" style="height: 48px; font-weight:bold; font-size: 14px" v-model="selectedCategory">
                                <option v-for="category in categories" v-bind:key="category.id" v-bind:value="category.id">{{category.name}}</option>
                            </select>
                        </div>    
                    </div>


                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Description</label>
                        <div class="col-sm-8">
                            <textarea class="form-control" cols=10 rows=10 id="inputEmail3" placeholder="Description" v-model="description" @input="$v.description.$touch()"></textarea>      
                            <span class="text-danger" v-if="!$v.description.required && $v.description.$dirty">description is required</span>
                            <span class="text-danger" v-if="!$v.description.maxLength">description can not be longer than 500 characters</span>
                        </div>    
                    </div>                                                
                        
                    <!-- <router-link class="btn btn-danger btn-round fa fa-close" style="position:absolute; top:10px; right: 10px; color: white" :to="'/manage/products'"></router-link>       -->
                </form>
            </div>
		</div>
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
  name: "IndexCategory",
  data() {
    return {
      name: "",
      condition: "",
      category: "",
      description: "",
      price: 0,
      isNew: true,
      isUsed: false,
      categories: [],
      selectedCategory: -1,
      dropzoneOptions: {
        url: "http://localhost:2000/resources/upload",
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: this.$auth.AH(),
        maxFiles: 5,
        dictDefaultMessage: "drop your item`s images here",
        addRemoveLinks: true
      },
      ex: "",
      addressStatus: true
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
  mounted: function() {    
    let those = this;    
    this.axios
      .get(this.$gc.getBaseUrl("categories"), { headers: this.$auth.AH() })
      .then(function(data) {
        those.$gc.saveItemByKey(
          "categories",
          JSON.stringify(data.data.categories)
        );
        those.categories = data.data.categories;
        those.selectedCategory = those.categories.find(e => e.name == "All").id;
      })
      .catch(function(error) {
        those.categories = those.$gc.getItemByKey("categories");
        those.selectedCategory = those.categories.find(e => e.name == "All").id;
      });
  }
};
</script>
<style scoped>

</style>
