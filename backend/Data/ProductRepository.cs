using System;
using System.Collections.Generic;
using System.Linq;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public ProductRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public CartCheckDto GetProductByIdAsync(int Id,List<int> Icollors,List<int> Isizes,int Quantity)
        {
                        
          var product =  _context.Products
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
           .FirstOrDefault(i => i.Id == Id);
          
          var ncolors = product.Colors.Where(i => Icollors.Contains(i.Id));
          var nsizes = product.Sizes.Where(i => Isizes.Contains(i.Id));
          
          
          var proret = new CartCheckDto{
            Id = product.Id,
            PictureUrl = product.image1,
            ProductName = product.Name,
            Price = product.Price,
            Quantity = Quantity,
            Size = nsizes.Select(a => new Sizes{ 
              Id = a.Id,
              Name = a.Name,
              Quantity = a.Quantity
            }).ToList(),
            Color = ncolors.Select(a => new Colors{ 
              Id = a.Id,
              Name = a.Name,
              Quantity = a.Quantity
            }).ToList(),
          };
          
          
          return proret;


        }
        public CartCheckDto CartCheck(int Id,List<int> Icollors,List<int> Isizes,int Quantity)
        {

          try
            {
                var product =  _context.Products
                    .Include(v => v.Colors)
                    .Include(v => v.Sizes)
                    .FirstOrDefault(i => i.Id == Id);

          
          var ncolors = product.Colors.Where(i => Icollors.Contains(i.Id));
          var nsizes = product.Sizes.Where(i => Isizes.Contains(i.Id));


          if(Icollors.Count != 0){
              if(ncolors.Count() != Icollors.Count){
                 return null;
              }
          }
          if(Isizes.Count != 0){
              if(nsizes.Count() != Isizes.Count){
                 return null;
              }
          }
          
          
          var proret = new CartCheckDto{
            Id = product.Id,
            PictureUrl = product.image1,
            ProductName = product.Name,
            Price = product.Price,
            Quantity = product.Quantity,
            Size = nsizes.Select(a => new Sizes{ 
              Id = a.Id,
              Name = a.Name,
              Quantity = a.Quantity
            }).ToList(),
            Color = ncolors.Select(a => new Colors{ 
              Id = a.Id,
              Name = a.Name,
              Quantity = a.Quantity
            }).ToList(),
          };
          
          
          return proret;


        }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            } 


        }

    }
}