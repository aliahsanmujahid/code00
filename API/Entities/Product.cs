using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int cateId { get; set; }
        public int subcateId { get; set; }
        public int subsubcateId { get; set; }
        public string Name { get; set; }
        public string HighLights { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int DiscPrice { get; set; }
        public int DisCount { get; set; }
        public Boolean Bundel { get; set; }
        public int Quantity { get; set; }
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public string image1 { get; set; }
        public string image2 { get; set; }
        public string image3 { get; set; }
        public string image4 { get; set; }
         public string youtubeLink { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public ICollection<Colors> Colors { get; set; } = new List<Colors>();
        public ICollection<Sizes> Sizes { get; set; } = new List<Sizes>();

    }
}