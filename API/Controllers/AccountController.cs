using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly DataContext _context;
        public AccountController(UserManager<AppUser> userManager, DataContext context,
        SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
        }
        
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.email);

            if (user == null){
                return await gRegister(loginDto);
            }

            // if(user != null ){
            var result = await _signInManager.CheckPasswordSignInAsync(user, "poipoi", false);

            if (result.Succeeded)
            {
               var roles = await _userManager.GetRolesAsync(user);

               foreach(var role in roles){
                    if(role != "Admin" && role != "Moderator" && role != "Seller"){
                       user.DisplayName = loginDto.username;
                       user.Image = loginDto.image;
                       _context.SaveChanges();
                    }else{
                       user.Image = loginDto.image;
                       _context.SaveChanges();
                    }
              }

                return await CreateUserObject(user);
            }
            // }

            return BadRequest("Problem Login user");

           
        }
        [Authorize]
        [HttpPost("setname/{name}")]
        public async Task<ActionResult> setname(string name)
        {
            var user = _context.Users.Find(User.GetUserId());

            if(name.ToLower() == "eidhat"){
               var roles = await _userManager.GetRolesAsync(user);

               foreach(var role in roles){
                    if(role != "Seller"){
                        user.DisplayName = name;
                        _context.SaveChanges();
                    }
               }
            }else{
                user.DisplayName = name;
                _context.SaveChanges();
            }  
            return Ok(user);
            
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> gRegister(LoginDto loginDto)
        {

            var rand = new Random();
            int code = rand.Next(1, 10000);


            var user = new AppUser
            {
                DisplayName = loginDto.username,
                UserName = loginDto.username.Replace(" ", "")+string.Format(code.ToString()),
                Image = loginDto.image,
                Email = loginDto.email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, "poipoi");

            // if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            // if (!roleResult.Succeeded) return BadRequest(result.Errors);

            // if (result.Succeeded)
            // {
                
                return  await CreateUserObject(user);
            // }

            // return BadRequest("Problem registering user");
        }



        private async Task<UserDto> CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Email = user.Email,
                Image = user.Image,
                Token = await _tokenService.CreateToken(user),
            };
        }


    
    }
} 