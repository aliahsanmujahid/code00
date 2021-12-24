using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class CartCheckDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public List<Colors> Color { get; set; }
        public List<Sizes> Size { get; set; }
    }
}