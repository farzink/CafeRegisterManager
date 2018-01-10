<template>
   <div class="row justify-content-center parent">
			<div class="card m-5 p-2 subparent" style="width: 60rem;">
        <div class="card-body">
          <h4 class="card-title">Add New Product</h4>
          <h6 class="card-subtitle mb-4 text-muted ">please enter your product details below</h6>
            <form>
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-3 col-form-label">Name</label>
                <div class="col-sm-8">
                  <input class="form-control" id="inputEmail3" placeholder="Name" v-model="name" @input="$v.name.$touch()">      
                  <span class="text-danger" v-if="!$v.name.required && $v.name.$dirty">name is required</span>
                  <span class="text-danger" v-if="!$v.name.maxLength">name can not be longer than 40 characters</span>
                </div>    
              </div>
              <div class="form-group has-danger">
                <label class="form-control-label" for="inputDanger1">Input with danger</label>
                <input type="text" class="form-control form-control-danger" id="inputDanger1">
                <div class="form-control-feedback">Sorry, that username's taken. Try another?</div>
                <small class="form-text text-muted">Example help text that remains unchanged.</small>
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
                  <b-form-group id="category"                                
                                label-for="exampleInput3">
                    <b-form-select id="exampleInput3"
                                  :options="categoriesOptions"
                                  required
                                  v-model="selectedCategory">
                    </b-form-select>
                  </b-form-group>
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
              
              <div class="form-group row">
                <div class="col-sm-12 offset-md-9 col-md-3">
                  <router-link class="btn btn-danger m-3shop" v-if="!addressStatus" style="position:absolute; top:10px; right: 10px; color: white" :to="'/profile'">You need to add your address to add product</router-link>      
                  <button class="btn btn-primary"  style="width: 8rem" v-if="addressStatus"  @click="add" v-bind:class="{disabled: $v.$invalid}">Add</button>
                </div>         
              </div>                
              <router-link class="btn btn-danger btn-round fa fa-close" style="position:absolute; top:10px; right: 10px; color: white" :to="'/manage/products'"></router-link>      
            </form>  
          </div>
		  </div>
  </div> 
</template>
