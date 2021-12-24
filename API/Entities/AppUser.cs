using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public Address Address { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public ICollection<Product> Products { get; set; }
       
    }
}