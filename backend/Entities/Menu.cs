using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Menu
    {
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<SubMenu> SubMenu { get; set; } =  new List<SubMenu>();

    }
}