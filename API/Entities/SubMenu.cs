using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SubMenu
    {
    public int Id { get; set; }
    public string Name { get; set; }
    public int MenuId { get; set; }
    public  Menu Menu { get; set; }
    public ICollection<SubSubMenu> SubSubMenu { get; set; } =  new List<SubSubMenu>();
    
    }
}