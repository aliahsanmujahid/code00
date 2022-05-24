using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class MenuDto
    {
        public int id { get; set; }
        public string Name { get; set; }
        public List<SubDto> SubDto { get; set; } = new List<SubDto>();

    }
}