using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;

namespace API.Data
{
    public class FavRepository : IFavRepository
    {
        private readonly DataContext _context;
        public FavRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Favorite> GetUserFav(int appUserId, int productId)
        {
             return await _context.Favorites.FindAsync(appUserId, productId);
        }
    }
}