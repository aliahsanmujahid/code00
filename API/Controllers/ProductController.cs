using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductController : BaseApiController
    {

        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [Authorize(Policy = "SellerRole")]
        [HttpPost("create")]
        public ProductToReturnDto createproduct(ProductDto productDto){

           var userProduct = _context.Users
           .Include(p => p.Products)
           .FirstOrDefault(i => i.Id == User.GetUserId());
           
          var mpro = _mapper.Map<ProductDto, Product>(productDto);

          float discount = mpro.DiscPrice - mpro.Price;


          float totalDisc = (discount / mpro.DiscPrice) * 100;

          mpro.DisCount = (int)totalDisc;

          userProduct.Products.Add(mpro);

          _context.SaveChanges();

          var product = _context.Products
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
          .FirstOrDefault(i => i.Id == mpro.Id);

          return _mapper.Map<Product, ProductToReturnDto>(product);
          
        }
  
        [HttpGet("getProducts/{page}")]
        public async Task<IEnumerable<ProductToReturnDto>> getProductsAsync(int page){

           var products = _context.Products
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
           .AsQueryable();


          //return _mapper.Map<IEnumerable<Product>,IEnumerable<ProductToReturnDto>>(products);
          var rproduct =  await PagedList<ProductToReturnDto>.CreateAsync(products.ProjectTo<ProductToReturnDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);

          Response.AddPaginationHeader(rproduct.CurrentPage, rproduct.PageSize, 
                rproduct.TotalCount, rproduct.TotalPages);    

          return rproduct;            
          
        }
        
        [HttpGet("getSellerProducts/{id}/{page}")]
        public async Task<IEnumerable<ProductToReturnDto>> getSellerProductsAsync(int id,int page)
        {
           var products = _context.Products
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
          .Where(a => a.AppUserId == id)  
          .AsQueryable();

          //return _mapper.Map<IEnumerable<Product>,IEnumerable<ProductToReturnDto>>(products);
          var rproduct =  await PagedList<ProductToReturnDto>.CreateAsync(products.ProjectTo<ProductToReturnDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);
          Response.AddPaginationHeader(rproduct.CurrentPage, rproduct.PageSize, 
                rproduct.TotalCount, rproduct.TotalPages);    

          return rproduct;          
        }
        [HttpGet("{id}")]
        public async Task<ProductToReturnDto> getProductAsync(int id){
          
          
           var product = await _context.Products
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
          .FirstAsync(i => i.Id == id);

          return _mapper.Map<Product,ProductToReturnDto>(product);
          
        }

        [HttpDelete("deleteproduct/{id}")]
        public ActionResult deleteproduct(int id)
        {

            var product =  _context.Products.Find(id);

            _context.Products.Remove(product);
            _context.SaveChanges();

            return Ok();
        }





    [HttpGet("getCateProduct/{id}/{page}")]
    public async Task<IEnumerable<ProductToReturnDto>>  getCate(int id,int page){
          
          
           var products = _context.Products
           .Where(c => c.cateId == id)
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
           .AsQueryable();

          //return _mapper.Map<IEnumerable<Product>,IEnumerable<ProductToReturnDto>>(products);
          var rproduct =  await PagedList<ProductToReturnDto>.CreateAsync(products.ProjectTo<ProductToReturnDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);
          Response.AddPaginationHeader(rproduct.CurrentPage, rproduct.PageSize, 
                rproduct.TotalCount, rproduct.TotalPages);    

          return rproduct;    

          
    }
    [HttpGet("getsubCateProduct/{id}/{page}")]
    public async Task<IEnumerable<ProductToReturnDto>> getsubCate(int id,int page){
          
          
        var products = _context.Products
           .Where(c => c.subcateId == id)
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
          .AsQueryable();

         var rproduct =  await PagedList<ProductToReturnDto>.CreateAsync(products.ProjectTo<ProductToReturnDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);
          Response.AddPaginationHeader(rproduct.CurrentPage, rproduct.PageSize, 
                rproduct.TotalCount, rproduct.TotalPages);    

          return rproduct; 

          
    }
    [HttpGet("getsubsubCateProduct/{id}/{page}")]
    public async Task<IEnumerable<ProductToReturnDto>> getsubsubCate(int id,int page){
          
          
           var products = _context.Products
           .Where(c => c.subsubcateId == id)
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
           .AsQueryable();

          var rproduct =  await PagedList<ProductToReturnDto>.CreateAsync(products.ProjectTo<ProductToReturnDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);
          Response.AddPaginationHeader(rproduct.CurrentPage, rproduct.PageSize, 
                rproduct.TotalCount, rproduct.TotalPages);    

          return rproduct; 
    }
    [HttpGet("searchProduct/{text}/{page}")]
    public async Task<IEnumerable<ProductToReturnDto>> searchProduct(string text,int page){
          
          
           var products =  _context.Products
           .Where(s => s.Name.ToLower().Contains(text.ToLower()))
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
           .AsQueryable();

          var rproduct =  await PagedList<ProductToReturnDto>.CreateAsync(products.ProjectTo<ProductToReturnDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);
          Response.AddPaginationHeader(rproduct.CurrentPage, rproduct.PageSize, 
                rproduct.TotalCount, rproduct.TotalPages);    

          return rproduct; 
    }







    [HttpPut("updateproduct/{id}")]
    public ProductToReturnDto Updateproduct(int id, ProductDto productDto){
          
          var uproduct = _context.Products
          .Include(v => v.Colors)
          .Include(v => v.Sizes)
          .FirstOrDefault(i => i.Id == id);

          foreach(var vid in uproduct.Colors.ToList().Select(i => i.Id)){
            var colors = _context.Colors.Find(vid);
            _context.Colors.Remove(colors);
          }
          foreach(var vid in uproduct.Sizes.ToList().Select(i => i.Id)){
            var sizes = _context.Sizes.Find(vid);
            _context.Sizes.Remove(sizes);
          }
          _context.SaveChanges();
          
          var mpro = _mapper.Map<ProductDto, Product>(productDto, uproduct);

          float discount = mpro.DiscPrice - mpro.Price;


          float totalDisc = (discount / mpro.DiscPrice) * 100;

          mpro.DisCount = (int)totalDisc;

          _context.SaveChanges();

          var product = _context.Products
           .Include(v => v.Colors)
           .Include(v => v.Sizes)
          .FirstOrDefault(i => i.Id == mpro.Id);

          return _mapper.Map<Product,ProductToReturnDto>(product);
          
        }



    }
}