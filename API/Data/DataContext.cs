using System.Reflection;
using API.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int, 
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, 
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Menu> Menu { get; set; }
        public DbSet<SubMenu> SubMenu { get; set; }
        public DbSet<SubSubMenu> SubSubMenu { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Colors> Colors { get; set; }
        public DbSet<Sizes> Sizes { get; set; }
        public DbSet<UserAddress> UserAddress { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Address> Address { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<ChangeId> ChangeIds { get; set; }
        public DbSet<District> District { get; set; }
        public DbSet<Upazilla> Upazilla { get; set; }
        public DbSet<Utlites> Utlites { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

           
            //one to many relation between book and publisher
            builder.Entity<SubMenu>()
               .HasOne(b => b.Menu)
               .WithMany(b => b.SubMenu)
               .HasForeignKey(b => b.MenuId)
               .OnDelete(DeleteBehavior.Cascade);

            //one to many relation between book and publisher
            builder.Entity<SubSubMenu>()
               .HasOne(b => b.SubMenu)
               .WithMany(b => b.SubSubMenu)
               .HasForeignKey(b => b.SubMenuId)
               .OnDelete(DeleteBehavior.Cascade);   

            //one to many relation between book and publisher
            builder.Entity<Colors>()
               .HasOne(b => b.Product)
               .WithMany(b => b.Colors)
               .HasForeignKey(b => b.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

            //one to many relation between book and publisher
            builder.Entity<Sizes>()
               .HasOne(b => b.Product)
               .WithMany(b => b.Sizes)
               .HasForeignKey(b => b.ProductId)
               .OnDelete(DeleteBehavior.Cascade); 

            //one to many relation between book and publisher
            builder.Entity<OrderItem>()
               .HasOne(b => b.Order)
               .WithMany(b => b.OrderItems)
               .HasForeignKey(b => b.OrderId)
               .OnDelete(DeleteBehavior.Cascade);      

            //one to many relation
            builder.Entity<Favorite>()
                .HasKey(k => new {k.AppUserId, k.ProductId});
            builder.Entity<Favorite>()
                .HasOne(s => s.AppUser)
                .WithMany(l => l.Favorites)
                .HasForeignKey(s => s.AppUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Favorite>()
                .HasOne(s => s.Product)
                .WithMany(l => l.Favorites)
                .HasForeignKey(s => s.ProductId)
                .OnDelete(DeleteBehavior.Restrict);    

        }    

        
    }
}