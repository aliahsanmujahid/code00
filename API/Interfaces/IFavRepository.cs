using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IFavRepository
    {
        Task<Favorite> GetUserFav(int appUserId, int productId);
    }
}