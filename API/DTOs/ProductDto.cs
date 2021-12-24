using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using API.Entities;

namespace API.Dtos
{
    public class ProductDto
    {
        public string Name { get; set; }
        public int CateId { get; set; }
        public int SubcateId { get; set; }
        public int SubsubcateId { get; set; }
        public string HighLights { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int DiscPrice { get; set; }
        public int DisCount { get; set; }
        public Boolean Bundel { get; set; }
        public int Quantity { get; set; }
        public string image1 { get; set; }
        public string image2 { get; set; }
        public string image3 { get; set; }
        public string image4 { get; set; }
        public string  youtubeLink { get; set; }
        public List<Colors> Colors { get; set; }
        public List<Sizes> Sizes { get; set; }

    }
}