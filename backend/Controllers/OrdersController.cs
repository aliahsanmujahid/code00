using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class OrdersController  : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IProductRepository _productRepo;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public OrdersController(DataContext context,IProductRepository productRepo, UserManager<AppUser> userManager,IMapper mapper)
        {
             _productRepo = productRepo;
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }


        [Authorize]
        [HttpGet("getSellerOrders/{id}/{page}/{status}")]
        public async Task<ActionResult<IEnumerable<Order>>> getSellerOrders(int id,int page,string status){

         var user = _context.Users.Find(User.GetUserId());

         if(user.Id != id){
            var roles = await _userManager.GetRolesAsync(user);
              foreach(var role in roles){
                    if(role != "Admin" && role != "Moderator"){
                     return Unauthorized();
                    }
              }
         }
           
           var orders = _context.Orders.AsQueryable();
           if(status == "All"){
              orders = _context.Orders
           .Where(i => i.Seller_id == id)
           .Include(v => v.OrderItems);
           }else{
            orders = _context.Orders
           .Where(i => i.Seller_id == id && i.Status == status)
           .Include(v => v.OrderItems);
           }


          var mappedorders =  await PagedList<Order>.CreateAsync(orders.ProjectTo<Order>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);

          Response.AddPaginationHeader(mappedorders.CurrentPage, mappedorders.PageSize, 
                mappedorders.TotalCount, mappedorders.TotalPages);    

          return mappedorders;            
          
        }
        [Authorize]
        [HttpGet("getCustomerOrders/{id}/{page}/{status}")]
        public async Task<ActionResult<IEnumerable<Order>>> getCustomerOrders(int id,int page,string status){


         var user = _context.Users.Find(User.GetUserId());
         
         if(user.Id != id){
            var roles = await _userManager.GetRolesAsync(user);
              foreach(var role in roles){
                    if(role != "Admin" && role != "Moderator"){
                     return Unauthorized();
                    }
              }
         }

          var orders = _context.Orders.AsQueryable();
           if(status == "All"){
              orders = _context.Orders
           .Where(i => i.Customer_id == id)
           .OrderByDescending(i => i.Id)
           .Include(v => v.OrderItems);
           }else{
            orders = _context.Orders
           .Where(i => i.Customer_id == id && i.Status == status)
           .OrderByDescending(i => i.Id)
           .Include(v => v.OrderItems);
           } 


          var mappedorders =  await PagedList<Order>.CreateAsync(orders.ProjectTo<Order>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);

          Response.AddPaginationHeader(mappedorders.CurrentPage, mappedorders.PageSize, 
                mappedorders.TotalCount, mappedorders.TotalPages);    

          return mappedorders;            
          
        }
        [Authorize(Policy = "SellerRole")]
        [HttpGet("getOrderById/{id}/{sellerid}")]
        public async  Task<Order> getOrderById(int id,int sellerid){

          try{
           var orderd = _context.Orders
           .Include(v => v.OrderItems)
           .First(i => i.Id == id || i.Randnum == id);

          var user = _context.Users.Find(User.GetUserId());

          if(orderd.Seller_id != User.GetUserId()){

              var roles = await _userManager.GetRolesAsync(user);
              foreach(var role in roles){
                    if(role != "Admin" && role != "Moderator"){
                     return null;
                    }else{
                      if(orderd.Seller_id != sellerid){
                          return null;
                      } 
                    }
              }
           }
          
  
          var order = _mapper.Map<Order, Order>(orderd);

          return order; 

          }catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }

       
          
        }

        [Authorize(Policy = "SellerRole")]
        [HttpPut("changeStatus/{id}/{userid}/{status}")]
        public async Task<ActionResult<Order>> update(int id,int userid,string status){
           
         var user = _context.Users.Find(User.GetUserId());
     

          if(user.Id != userid){
               return Unauthorized();
           }

          var roles = await _userManager.GetRolesAsync(user);
              foreach(var role in roles){
                    if(role != "Admin" && role != "Moderator" && role != "Seller"){
                       return Unauthorized();
                    }
              }

          var order  = _context.Orders.Find(id);
          
          foreach(var role in roles){
                    if(role == "Seller"){
                       if(order.Seller_id != user.Id){
                           return Unauthorized();
                       }
                    }
              }


          order.Status = status;
          _context.SaveChanges();
          return Ok(order);

        }
        [Authorize]
        [HttpPut("changecutomerstatus/{id}/{userid}/{status}")]
        public  ActionResult<Order> changecutomerstatus(int id,int userid,string status){
           
         var user = _context.Users.Find(User.GetUserId());
         

        if(user.Id != userid){
               return  Unauthorized();
        }

         if(status == "Confirmed"){
             var order  = _context.Orders.Find(id);
             order.Status = status;
             _context.SaveChanges();
             return Ok(order);  
         } 
         if(status == "Delivered"){
             var order  = _context.Orders.Find(id);
             order.Status = status;
             _context.SaveChanges();
             return Ok(order);  
         } 
          return BadRequest();

        }








        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("deleteOrder/{id}")]
        public  ActionResult deleteOrder(int id){

           var order = _context.Orders.Find(id);
           
          _context.Orders.Remove(order); 

          _context.SaveChanges();

          return Ok();            
          
        }

 




















        [Authorize] 
        [HttpPost("order")]
        public ActionResult order(OrderDto orderDto){

           var items = new List<CartCheckDto>();
           foreach(var item in orderDto.OrderItemDto){

             var Isizes = new List<int>();
             var Icolors = new List<int>();

                if(item.size_id != 0){
          
                 Isizes.Add(item.size_id);
                  
                }
                if(item.color_id != 0){

                 Icolors.Add(item.color_id);
                  
                } 
            var productItem = _productRepo.GetProductByIdAsync(item.Id,Icolors,Isizes,item.Quantity);
            items.Add(productItem);
           }

          int subtotal = 0; 

          for(int  i = 0 ; i<items.Count; i++){
            if(orderDto.OrderItemDto[i].Price != items[i].Price){
                 return BadRequest();
            }
            var sitem = items[i].Price * items[i].Quantity;

            subtotal = subtotal + sitem;

          }

          for(int  i = 0 ; i<items.Count; i++){
            if(orderDto.OrderItemDto[i].color_id != 0){
                 if(items[i].Color.Count != 1){
                     return BadRequest();
                 }
            }
            if(orderDto.OrderItemDto[i].size_id != 0){
                 if(items[i].Size.Count != 1){
                     return BadRequest();
                 }
            }
          }


          
          if(orderDto.Customer_id == orderDto.Seller_id){
                     return BadRequest();
            }

          
          
          if(orderDto.Seller_id == 0){
           return BadRequest();
          }
           
          var order = _mapper.Map<OrderDto, Order>(orderDto);

          order.Customer_id = User.GetUserId();
          order.Status = "Pending";
          order.Subtotal = subtotal;
          order.Delivery = 50;

            
          Random rnd = new Random();

          int num = rnd.Next(1000000000); 
      
          order.Randnum = User.GetUserId()+orderDto.Seller_id+num;

          order.Total = subtotal + order.Delivery;

          _context.Orders.Add(order);



          foreach(var dto in orderDto.OrderItemDto){
            if(dto.size_id != 0){
          
                var size = _context.Sizes.Find(dto.size_id);
                size.Quantity--;
                   _context.SaveChanges();
                }
                if(dto.color_id != 0){

                  var color = _context.Colors.Find(dto.color_id);
                   color.Quantity--;
                   _context.SaveChanges();
                } 
            
            var product = _context.Products.Find(dto.Id);
            product.Quantity--;
             _context.SaveChanges();
          }

          _context.SaveChanges();

          return Ok();
          
        }
















        [HttpPost("ordercheck")]
        public Boolean ordercheck(List<CartCheckDto> cartCheckDto){


           var items = new List<CartCheckDto>();
           foreach(var item in cartCheckDto){

             var Isizes = new List<int>();
             var Icolors = new List<int>();

                if(item.Size.Count() > 0){
          
                 Isizes = item.Size.Select(i => i.Id).ToList();
                  
                }
                if(item.Color.Count() > 0){

                 Icolors = item.Color.Select(i => i.Id).ToList();
                  
                } 
            var productItem = _productRepo.CartCheck(item.Id,Icolors,Isizes,item.Quantity);
             if(productItem == null){
               return true;
              }
            items.Add(productItem);
           }
           
           foreach(var item in items){

              if(item.Quantity == 0){
          
                 return true;
                  
                }
              
              if(item.Size.Count() > 0){
                  
                  foreach(var s in item.Size){
                  if(s.Quantity == 0){
          
                       return true;
                  
                   }
                  }
                 
                  
                }
                if(item.Color.Count() > 0){

                 foreach(var s in item.Color){
                  if(s.Quantity == 0){
          
                       return true;
                  
                   }
                  }
                  
                } 

           }

           for(int i=0; i<items.Count(); i++){
               if(items[i].Price != cartCheckDto[i].Price){
                   return true;
               }
           }

           return false;
          
        }
        


    }
}