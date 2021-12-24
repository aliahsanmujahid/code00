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
        private readonly IFavRepository _favRepo;

        public ProductController(DataContext context, IMapper mapper, IFavRepository favRepo)
        {
            _context = context;
            _mapper = mapper;
            _favRepo = favRepo;
        }

        [HttpPost("create")]
        public ProductToReturnDto createproduct(ProductDto productDto){

           var userProduct = _context.Users
           .Include(p => p.Products)
           .FirstOrDefault(x => x.Email == User.RetrieveEmailFromPrincipal());
           
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
        [HttpGet("getUserProducts/{id}/{page}")]
        public async Task<IEnumerable<ProductToReturnDto>> getUserProductsAsync(int id,int page)
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


    [AllowAnonymous]
    [HttpPost("addFav/{id}")]
    public IActionResult addFav(int id){
         
      var favproduct = new Favorite
            {
                AppUserId = User.GetUserId(),
                ProductId = id
            };   

        _context.Favorites.Add(favproduct);

        _context.SaveChanges();

        return Ok();
         
    }
    [AllowAnonymous]
    [HttpPost("removeFav/{id}")]
    public IActionResult removeFav(int id){
         
         
        Favorite fav = _context.Favorites.FirstOrDefault(
                u => u.AppUserId ==  User.GetUserId() && u.ProductId == id);

        _context.Favorites.Remove(fav);
        _context.SaveChanges();  


        return Ok();
         
    }
    [AllowAnonymous]
    [HttpGet("getFavProducts")]
    public IEnumerable<ProductToReturnDto> getFavProducts(){
         
        var favproduct = _context.Favorites.AsQueryable();

            
        favproduct = favproduct.Where(id =>  id.AppUserId == User.GetUserId());
        var ids = favproduct.Select(f => f.ProductId).ToList();
        
        var products = _context.Products.Where(i => ids.Contains(i.Id))
        .Include(c => c.Colors)
        .Include(s => s.Sizes);

        return _mapper.Map<IEnumerable<Product>,IEnumerable<ProductToReturnDto>>(products);
          
    } 
    [HttpGet("isFavorited/{id}")]
    public bool isFavorited(int id)
    {
        
       var isfav =  _context.Favorites.FirstOrDefault(
                u => u.AppUserId ==  User.GetUserId() && u.ProductId == id);
        
        if(isfav != null){
            return true;
        }
        return false; 
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