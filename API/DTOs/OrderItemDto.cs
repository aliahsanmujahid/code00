using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public int color_id { get; set; }
        public string color_name { get; set; }
        public int size_id { get; set; }
        public string size_name { get; set; }
    }
}