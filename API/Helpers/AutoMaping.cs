using System;
using System.Collections.Generic;
using System.Linq;
using API.Dtos;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class AutoMaping : Profile
    {
        public AutoMaping(){ 


        CreateMap<AddressDto, Address>();
        CreateMap<Address, AddressDto>();    


        CreateMap<Upazilla,SubMenuDto>();
        CreateMap<AppUser,SellerDto>()
        .ForMember(vr => vr.Phone, opt => opt.MapFrom( vf => vf.Address.Phone) )
        .ForMember(vr => vr.DistrictId, opt => opt.MapFrom( vf => vf.Address.DistrictId) )
        .ForMember(vr => vr.District, opt => opt.MapFrom( vf => vf.Address.District) )
        .ForMember(vr => vr.UpazilaId, opt => opt.MapFrom( vf => vf.Address.UpazilaId) )
        .ForMember(vr => vr.Upazila, opt => opt.MapFrom( vf => vf.Address.Upazila) );
        

        CreateMap<District,MenuDto>()
         .ForMember(vr => vr.SubDto, opt => opt.MapFrom(v => v.Upazilla.Select(vf => new SubDto {id = vf.Id, Name = vf.Name} )));
        


        CreateMap<OrderDto, Order>()
        .ForMember(vr => vr.OrderItems, opt => opt.MapFrom(v => v.OrderItemDto.Select(vf => new OrderItem { Name = vf.ProductName,Price = vf.Price,Quantity=vf.Quantity,TotalPrice = vf.Price*vf.Quantity,Color = vf.color_name,Size=vf.size_name})));
        CreateMap<Order,Order>()
        .ForMember(vr => vr.OrderItems, opt => opt.MapFrom(v => v.OrderItems.Select(vf => new OrderItem { Name = vf.Name,Price = vf.Price,Quantity=vf.Quantity,TotalPrice = vf.Price*vf.Quantity,Color = vf.Color,Size=vf.Size})));
       
 


        CreateMap<Menu, MenuDto>()
         .ForMember(vr => vr.SubDto, opt => opt.MapFrom(v => v.SubMenu.Select(vf => new SubDto {id = vf.Id, Name = vf.Name, SubSubDto = vf.SubSubMenu.Select( s => new SubSubDto{id = s.Id, Name = s.Name})})));
         
        CreateMap<Product, ProductToReturnDto>()
         .ForMember(vr => vr.Colors, opt => opt.MapFrom(v => v.Colors.Select(vf => new Colors { Id = vf.Id, Name = vf.Name, ColorCode = vf.ColorCode, Quantity = vf.Quantity })))
         .ForMember(vr => vr.Sizes, opt => opt.MapFrom(v => v.Sizes.Select(vf => new Sizes { Id = vf.Id, Name = vf.Name, Quantity = vf.Quantity})));
        

        CreateMap<ProductDto, Product>()
        .ForMember(v => v.Colors, opt => opt.Ignore())
        .ForMember(v => v.Sizes, opt => opt.Ignore())
              .AfterMap((vr, v) => {
                  
               if(vr.Colors != null){
                 // Add new Variables
                var addColor = vr.Colors.Select(v => new Colors { Name = v.Name,  ColorCode = v.ColorCode,  Quantity = v.Quantity }).ToList();   
                foreach (var f in addColor){
                    v.Colors.Add(f);  
                }
               }
               if(vr.Sizes != null){
                 // Add new Variables
                var addedSizes = vr.Sizes.Select(v => new Sizes { Name = v.Name, Quantity = v.Quantity }).ToList();   
                foreach (var f in addedSizes){
                    v.Sizes.Add(f);  
                }
               }

            }); 
        }
        
    }
}