using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    public class ProfileController : BaseApiController
    {

        private readonly UserManager<AppUser> _userManager;
        public ProfileController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }
        
        // [Authorize]
        // [HttpGet]
        // public async Task<ActionResult<UserDto>> GetCurrentUser()
        // {
        //     var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        //     return await CreateUserObject(user);
        // }
        
    }
}