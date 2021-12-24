using System.Collections.Generic;

namespace API.Entities
{
    public class BasketItem
    {
        public int Id { get; set; }
        public string eachnum { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public int? Price { get; set; }
        public int Quantity { get; set; }
        public ICollection<Colors> Color { get; set; } = new List<Colors>();
        public ICollection<Sizes> Size { get; set; } = new List<Sizes>();
        
    }
}