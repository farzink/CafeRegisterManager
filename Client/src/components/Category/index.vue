<template>
    <div class="row justify-content-center parent">
      <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
        <div class="card m-5 p-2 subparent">
            <div class="card-body">
                <h4 class="card-title d-4">List of Categoreis</h4>
                <h6 class="card-subtitle mb-4 text-muted ">You can view all the categories here</h6>
                <div class="row" v-if="categories.length > 0">
                    <!-- <b-card-group columns> -->
                        <b-card v-for="cat in categories" v-bind:key="cat.id" class="m-2"
                                :header="cat.code"
                                header-text-variant="dark"                                
                                header-bg-variant="light"                                
                                style="max-width: 18rem;min-width:18rem;"                                
                                :title="cat.name">
                            <p class="card-text">{{cat.description}}</p>
                            <b-button v-b-tooltip.hover title="Edit this category" @click="editCategory(cat)" class="btn btn-outline-success float-right">Edit
                            </b-button>
                            <b-button v-bind:style="{'background-color': cat.color}" v-b-tooltip.hover title="Category Color" class="btn rounded-circle">&nbsp;&nbsp;&nbsp;
                            </b-button>                            
                            <b-button style="position: absolute; top:10px; right: 10px" v-b-tooltip.hover title="Delete this category" @click="deleteCategory(cat)" class="btn btn-sm btn-outline-danger float-right fa fa-close">
                            </b-button>                            
                        </b-card>                        
                    <!-- </b-card-group> -->
                </div>
                <div v-else>
                    <span>
                        There are no categories yet! Start by adding 
                    </span>
                    <router-link class="btn btn-sm btn-primary" :to="'/categories/add'">
                        a new category
                    </router-link>    
                </div>
                <router-link class="btn btn-danger btn-round fa fa-close"
                        style="position:absolute; top:10px; right: 10px; color: white" :to="'/'">
                </router-link>   
                <div class="text-center" style="position:absolute; top:10px; right: 55px; color: white">
                    <b-btn class="btn-secondary fa fa-plus" @click="createCategory" v-b-tooltip.hover title="Create new category"></b-btn>
                </div>            
                <div class="text-center hidden-sm-down" style="position:absolute; top:10px; right: 100px; color: white">
                    <b-btn class="btn btn-info fa fa-refresh" @click="refreshCategories" v-b-tooltip.hover title="Refresh data from server"></b-btn>
                </div>            
            </div>
		</div>
        <b-modal id="confirmationModal"
                centered 
                hide-footer
                size="sm"
                ref="confirmationModal"                
                header-bg-variant="danger"
                title="Are you sure?">
            <div class="d-block text-center">
                <h3>You are about to delete this category. press delete button to proceed!</h3>
            </div>
            <b-btn class="mt-3" variant="danger" block @click="doDelete">Delete</b-btn>
        </b-modal>

        <b-modal id="creationModal"
                centered   
                hide-footer             
                size="lg"
                ref="creationModal"                                
                :title="modalTitle">
            <div class="d-block text-center">
                  <form>
                    <div class="form-group row">
                        <label for="categoryname" class="col-sm-3 col-form-label">Name</label>
                        <div class="col-sm-8">
                            <input class="form-control" id="categoryname" placeholder="Name" v-model="categoryToCreate.name">
                            <span class="text-danger" v-if="!$v.categoryToCreate.name.required && $v.categoryToCreate.name.$dirty">Name is required</span>
                            <span class="text-danger" v-if="!$v.categoryToCreate.name.maxLength">name can not be longer than 128 characters</span>
                        </div>    
                    </div>    
                         <div class="form-group row">
                        <label for="categorydescription" class="col-sm-3 col-form-label">Description</label>
                        <div class="col-sm-8">
                            <textarea rows="5" class="form-control" id="categorydescription" placeholder="Description" v-model="categoryToCreate.description"></textarea>                            
                        </div>    
                    </div>   
                         <div class="form-group row">
                        <label for="categorycode" class="col-sm-3 col-form-label">Code</label>
                        <div class="col-sm-8">
                            <input class="form-control" id="categorycode" placeholder="Code" v-model="categoryToCreate.code">                             
                            <span class="text-danger" v-if="!$v.categoryToCreate.code.required && $v.categoryToCreate.code.$dirty">Code is required</span>
                            <span class="text-danger" v-if="!$v.categoryToCreate.code.maxLength">Code can not be longer than 32 characters</span>
                        </div>    
                    </div>   
                         <div class="form-group row">
                        <label for="categoryColor" class="col-sm-3 col-form-label">Color</label>
                        <div class="col-sm-8">
                            <!-- <input class="form-control" id="categoryColor" placeholder="Color" v-model="categoryToCreate.color">                              -->
                            <input class="form-control rounded" type="color" id="categoryColor" v-model="categoryToCreate.color">
                        </div>    
                        <br><br>
                    </div> 

                    
                    <b-button v-if="modalMode == 'create'" class="btn-block" v-bind:class="{disabled: $v.$invalid}" type="button" @click="doCreateCategory" variant="primary">Save</b-button>
                    <b-button v-if="modalMode == 'edit'" class="btn-block" v-bind:class="{disabled: $v.$invalid}" type="button" @click="doEditCategory" variant="primary">Save</b-button>
                    <!-- <router-link class="btn btn-danger btn-round fa fa-close" style="position:absolute; top:10px; right: 10px; color: white" :to="'/manage/products'"></router-link>       -->
                </form>
            </div>            
        </b-modal>
    </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  name: "IndexCategory",
  data() {
    return {
      categories: [],
      categoryToDelete: {},
      categoryToCreate: {},
      modalTitle: "",
      modalMode: "create",
      isLoading: false,
      html: '<img src="static/puff.svg" />'
    };
  },
  methods: {
    doDelete() {
      this.isLoading = true;
      var self = this;
      var path = this.$gc.getBaseUrl("categories/" + this.categoryToDelete.id);
      this.axios
        .delete(path, { headers: this.$auth.AH() })
        .then(function(data) {
          var category = self.categories.find(
            e => e.id == self.categoryToDelete.id
          );
          var index = self.categories.indexOf(category);
          if (index !== -1) {
            self.categories.splice(index, 1);
            self.$gc.saveItemByKey(
              "categories",
              JSON.stringify(self.categories)
            );
          }
          self.$refs.confirmationModal.hide();
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
    },
    deleteCategory(cat) {
      this.testLSM();
      this.categoryToDelete = cat;
      this.$refs.confirmationModal.show();
    },
    createCategory() {
      this.modalMode = "create";
      this.categoryToCreate = {};
      this.modalTitle = "Create new category";
      this.$refs.creationModal.show();
    },
    doCreateCategory() {
      console.log(this.categoryToCreate.color === undefined);
      this.isLoading = true;
      var self = this;
      this.axios.defaults.headers.common["Authorization"] = this.$auth.FAH();
      this.axios
        .post(this.$gc.getBaseUrl("categories"), {
          name: this.categoryToCreate.name,
          description: this.categoryToCreate.description,
          code: this.categoryToCreate.code,
          color: (this.categoryToCreate.color === undefined) ? '#ffffff' : this.categoryToCreate.color
        })
        .then(function(data) {
          self.categories.push(data.data.result);
          self.$gc.saveItemByKey("categories", JSON.stringify(self.categories));
          self.$toasted.show("Category successfully created.");
          self.$refs.creationModal.hide();
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
      this.categoryToCreate = {};
    },
    editCategory(cat) {
      this.modalMode = "edit";
      this.categoryToCreate = {
        name: cat.name,
        description: cat.description,
        code: cat.code,
        color: cat.color,
        id: cat.id
      };
      this.modalTitle = "Edit category";
      this.$refs.creationModal.show();
    },
    doEditCategory() {
      this.isLoading = true;
      var self = this;
      this.axios.defaults.headers.common["Authorization"] = this.$auth.FAH();
      var path = this.$gc.getBaseUrl("categories/" + this.categoryToCreate.id);
      this.axios
        .put(path, {
          name: this.categoryToCreate.name,
          description: this.categoryToCreate.description,
          code: this.categoryToCreate.code,
          color: this.categoryToCreate.color
        })
        .then(function(data) {
          var category = self.categories.find(
            e => e.id == data.data.category.id
          );
          var index = self.categories.indexOf(category);
          if (index !== -1) {
            category.name = data.data.category.name;
            category.color = data.data.category.color;
            category.description = data.data.category.description;
            category.code = data.data.category.code;
            self.categories.splice(index, 1, category);
            self.$gc.saveItemByKey(
              "categories",
              JSON.stringify(self.categories)
            );
            self.$toasted.show("Category successfully Updated.");
          }
          self.$refs.creationModal.hide();
          self.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          self.isLoading = false;
        });
      this.categoryToCreate = {};
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
    testLSM() {
      this.$lsm.set(this.categories, "categories");
      this.$lsm.save();
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
  },
  validations: {
    categoryToCreate: {
      name: {
        required,
        maxLength: maxLength(128)
      },
      code: {
        required,
        maxLength: maxLength(32)
      }
    }
  }
};
</script>

