using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SubDto
    {
         public int id { get; set; }
         public string Name { get; set; }
         public IEnumerable<SubSubDto> SubSubDto { get; set; } =  new List<SubSubDto>();
    }
}