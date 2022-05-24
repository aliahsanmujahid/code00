using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SubSubMenu
    {
    public int Id { get; set; }
    public string Name { get; set; }
    public int SubMenuId { get; set; }
    public SubMenu SubMenu { get; set; }

    }
}