using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface  IProductRepository
    {
        CartCheckDto GetProductByIdAsync(int id ,List<int> Icollors,List<int> Isizes,int Quantity);
        CartCheckDto CartCheck(int id ,List<int> Icollors,List<int> Isizes,int Quantity);
        
    }
}