using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager,RoleManager<AppRole> roleManager)
        {
            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Seller"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };
            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
            
        // if (!userManager.Users.Any())
        //     {
        //         var users = new List<AppUser>
        //         {
        //             new AppUser{DisplayName = "Bob", UserName = "bob", Email = "bob@test.com"},
        //             new AppUser{DisplayName = "Tom", UserName = "tom", Email = "tom@test.com"},
        //             new AppUser{DisplayName = "Jane", UserName = "jane", Email = "jane@test.com"},
        //         };

        //         foreach (var user in users)
        //         {
        //             await userManager.CreateAsync(user, "poipoi");
        //             await userManager.AddToRoleAsync(user, "Member");
        //         }
        //     }
            var admin = new AppUser
            {
                DisplayName= "Mujahid",
                UserName = "admin",
                Email = "ahsanalimujahid@gmail.com",
                Image="https://lh3.googleusercontent.com/ogw/ADea4I7FTPL_BVWg3hTn9o3Bjc-WSYnp6HxT_XJ-3BIX1w=s83-c-mo"
            };

            await userManager.CreateAsync(admin, "poipoi");
            await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});

            
        }    
    }
}