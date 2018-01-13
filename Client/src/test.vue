
<template>
  <div>
      <BlockUI v-if="isLoading" message="Please Wait" :html="html"></BlockUI>
      <div class="row order">      
        <div class="category border">
          <div class="cat-container">
            <div class="cat-row" v-for="(cat, index) in getLSMCategories()" :key="index">
                <input type="button" class="btn" :value="cat.name" :style="{backgroundColor: cat.color}" @click="filterByCategory(cat.id)">
            </div>            
          </div>
        </div>
        <div class="main border">
            <div class="container-fluid">              
              <div class="row p-4 float-right">                
                <input type="button" @click="resetOrder" class="btn btn-round btn-warning text-light float-right" value="New" />
              </div>
              
              <div class="row p-4">
                Order Number: {{orderNo}}
              </div>
              <div class="row p-2 form-group border border-left-0 border-right-0">
                
                
          <label class="col-form-label offset-sm-6 col-sm-2 text-right" for="">Search</label>
            <div class="col-sm-4">
          <input ref="searchBox" class="form-control" type="text" @keyup="search()">
          </div>
          </div>
        
              <div class="row p-4" style="min-height:500px; max-height: 500px">
                <div class="div-item col-md-2" v-for="(item, index) in currentItems" :key="index">                  
                  <!-- <input type="button" class="btn btn-secondary btn-item m-1" :style="{backgroundColor: getItemBg(item.category_id, index)}" :value="item.name" @click="addToOrder(item)">
                  <a href="#" class="badge badge-light">{{item.code}}</a> -->
                  <button type="button" class="btn btn-secondary btn-item m-1" :style="{backgroundColor: getItemBg(item.category_id, index)}" @click="addToOrder(item)">
                    {{item.name}}                    
                  </button>
                  <!-- <span style="top:10px; left:10px; position: absolute;min-width: 64px; max-width: 64px;" href="#" class="badge badge-secondary">{{item.code}}</span> -->
                </div>
                <span v-if="currentItems.length < 1">no items</span>
              </div>



              <div class="row p-4 float-right border border-warning border-right-0 border-bottom-0">
                <span style="width: 20rem" class="h4 float-left">Total Price: {{totalPrice | currency}}</span>
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


