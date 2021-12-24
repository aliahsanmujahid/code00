using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Favorite
    {
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }

        public Product Product { get; set; }
        public int ProductId { get; set; }        
    }
}