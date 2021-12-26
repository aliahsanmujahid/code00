using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public AdminController(UserManager<AppUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        // [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .Where(r => r.UserRoles.Any(i => i.Role.Name == "Admin" || i.Role.Name == "Moderator" || i.Role.Name == "Seller"))
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Email = u.Email,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        // [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("getmembersemail")]
        public async Task<ActionResult> getmembersemail()
        {
            var users = await _userManager.Users
                .Where(r => r.UserRoles.Any(i => i.Role.Name == "Member"))
                .OrderByDescending(i => i.Id)
                .Select(u => new
                {
                    Email = u.Email,
                })
                .ToListAsync();

            return Ok(users);
        }



        [HttpGet("getsellers/{page}")]
        public async Task<IEnumerable<SellerDto>> getsellers(int page)
        {
            var users = _userManager.Users
                .Include(u =>u.Address)
                .Where(r => r.UserRoles.Any(i => i.Role.Name == "Seller"))
                .OrderBy(u => u.UserName)
                .AsQueryable();
                

            var sellers =  await PagedList<SellerDto>.CreateAsync(users.ProjectTo<SellerDto>(_mapper
                .ConfigurationProvider).AsNoTracking(), 
                    page, 10);

            Response.AddPaginationHeader(sellers.CurrentPage, sellers.PageSize, 
                sellers.TotalCount, sellers.TotalPages);  

            return sellers;     

        }


        [HttpGet("getuserbyid/{id}")]
        public async Task<SellerDto> getuserbyid(int id)
        {
            var users =  await _userManager.Users
                .Include(u =>u.Address)
                .FirstAsync(i => i.Id == id);


             return  _mapper.Map<AppUser,SellerDto>(users);
      

        }





        





        
        [HttpGet("getmemberscount")]
        public int getmemberscount(int page)
        {

          return _userManager.Users.Count();
 
        }

        // [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{email}")]
        public async Task<ActionResult> EditRoles(string email, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return NotFound("Could not find user");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }
        
    }
} 