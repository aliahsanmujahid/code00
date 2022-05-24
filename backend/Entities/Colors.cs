using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Colors
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ColorCode { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        public  Product Product { get; set; }
    }
}