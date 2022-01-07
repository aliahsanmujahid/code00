using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CategoryController: BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CategoryController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize(Policy = "ModerateRole")]
        [HttpPost("createmenu")]
        public ActionResult<Menu> createmenu(MenuDto menuDto)
        {

            var menu = new Menu {
                Name = menuDto.Name
            };

            _context.Menu.Add(menu);
            _context.SaveChanges();

            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();


            return menu;
         
           
        }
        [Authorize(Policy = "ModerateRole")]
        [HttpPost("createdisrict")]
        public List<District> createdisrict(MenuDto menuDto)
        {


            foreach(var item in _context.District.ToList()){
                  _context.District.Remove(item);
            }
            
            foreach(string dis in menuDto.Name.Split(',')){
              var district = new District {
                Name = dis
            };

            _context.District.Add(district);
            _context.SaveChanges();
            }


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();
          

            return _context.District.ToList();

            
        }
        [Authorize(Policy = "ModerateRole")]
        [HttpPost("createupazilla")]
        public  IEnumerable<SubMenuDto> createupazilla(SubMenuDto subMenuDto)
        {

            foreach(var item in _context.Upazilla.Where(i => i.DistrictId == subMenuDto.MenuId)){
                  _context.Upazilla.Remove(item);
            }

            var district = _context.District.Find(subMenuDto.MenuId);
            
            foreach(string upa in subMenuDto.Name.Split(',')){
              var upazilla = new Upazilla {
                Name = upa,
                District = district
            };
            
            _context.Upazilla.Add(upazilla);
            _context.SaveChanges();
            
            };

             
            var upazi = _context.Upazilla.ToList(); 


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();


            return _mapper.Map<List<Upazilla>,List<SubMenuDto>>(upazi);

        }
        [HttpGet("getdisrictsandupazilla")]
        public List<MenuDto> getdisricts()
        {

            var dis =  _context.District
            .Include(u => u.Upazilla)
            .ToList();

            return _mapper.Map<List<District>,List<MenuDto>>(dis);
 
        }




        [HttpGet("getmainmenu")]
        public async Task<IEnumerable<Menu>> getmainmenu()
        {

            return await _context.Menu.ToListAsync();

        }

        [HttpGet("getsubmenu")]
        public async Task<IEnumerable<SubMenu>> getsubmenu()
        {

            return await _context.SubMenu.ToListAsync();

        }

        [HttpGet("getsubsubmenu")]
        public async Task<IEnumerable<SubSubMenu>> getsubsubmenu()
        {

            return await _context.SubSubMenu.ToListAsync();

        }

        [Authorize(Policy = "ModerateRole")]
        [HttpPost("createsubmenu")]
        public ActionResult<SubMenu> createsubmenu(SubMenuDto subMenuDto)
        {

            var menu = _context.Menu.Find(subMenuDto.MenuId);
            if(menu == null){
                return BadRequest();
            }

            var subMenu = new SubMenu {
                Name = subMenuDto.Name,
                Menu = menu
            };

            _context.SubMenu.Add(subMenu);
            _context.SaveChanges();


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();


            return new SubMenu {
                Id = subMenu.Id,
                Name = subMenu.Name,
            };
           
        }
        [Authorize(Policy = "ModerateRole")]
        [HttpPost("createsubsubmenu")]
        public ActionResult<SubSubMenu> createsubsubmenu(SubMenuDto subMenuDto)
        {

            var SubMenu = _context.SubMenu.Find(subMenuDto.MenuId);
            if(SubMenu  == null){
                return BadRequest();
            }

            var subsubMenu = new SubSubMenu {
                Name = subMenuDto.Name,
                SubMenu = SubMenu 
            };

            _context.SubSubMenu.Add(subsubMenu);
            _context.SaveChanges();


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();


            return new SubSubMenu {
                Id = subsubMenu.Id,
                Name = subsubMenu.Name,
            };

           
        }

        [AllowAnonymous]
        [HttpGet("getmenu")]
        public async Task<IEnumerable<MenuDto>> getmenu()
        {

            var menu = await _context.Menu
                .Include(r => r.SubMenu)
                .ThenInclude(r => r.SubSubMenu)
                .ToListAsync();

            return _mapper.Map<IEnumerable<Menu>,IEnumerable<MenuDto>>(menu);  

         
        }

        
        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("deletemenu/{id}")]
        public ActionResult deletemenu(int id)
        {

            var menu =  _context.Menu.Find(id);

            _context.Menu.Remove(menu);
            _context.SaveChanges();


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();


            return Ok();
        }
        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("deletesubmenu/{id}")]
        public ActionResult deletesubmenu(int id)
        {

            var menu =  _context.SubMenu.Find(id);

            _context.SubMenu.Remove(menu);
            _context.SaveChanges();


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();

            return Ok();
        }
        [Authorize(Policy = "ModerateRole")]
        [HttpDelete("deletesubsubmenu/{id}")]
        public ActionResult deletesubsubmenu(int id)
        {

            var menu =  _context.SubSubMenu.Find(id);

            _context.SubSubMenu.Remove(menu);
            _context.SaveChanges();


            //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();

            return Ok();
        }

    
        [HttpGet("getsubcate/{id}")]
        public async Task<ActionResult> getsubcate(int id)
        {

            var submenu =  await _context.SubMenu.Where(i => i.MenuId == id).Select(u => new
                {
                    u.Id,
                    u.Name

                }).ToListAsync();

            return Ok(submenu);
       
        }
 
        [HttpGet("getsubsubcate/{id}")]
        public async Task<ActionResult> getsubsubcate(int id)
        {

            var subsubmenu =  await _context.SubSubMenu.Where(i => i.SubMenuId == id).Select(u => new
                {
                    u.Id,
                    u.Name

                }).ToListAsync();

            return Ok(subsubmenu);
       
        }














        [HttpPost("setchangeid")]
        public int setchangeid()
        {

          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
              return 0;
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          
          _context.SaveChanges();
         
          return changeid.Cid;
        }

        [HttpGet("getchangeid")]
        public int getchangeid()
        {

         try{
             var cid =  _context.ChangeIds.First();

             return cid.Cid;
         }catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
        }
         
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("createUtails")]
        public Utlites createUtails(UtilityDto utilityDto)
        {

        foreach(var item in _context.Utlites.ToList()){
                  _context.Utlites.Remove(item);
        }

        var utails = new Utlites{
            
            Bikash = utilityDto.Bikash,
            Rocket = utilityDto.Rocket,
            Namgad = utilityDto.Namgad,
            Desktoppic = utilityDto.Desktoppic,
            Mobilepic = utilityDto.Mobilepic

        };

          _context.Utlites.Add(utails);

          _context.SaveChanges();

          //auto change
          var changeid = _context.ChangeIds.Find(1);

          if(changeid == null){
              var cids = _context.ChangeIds.Add(new ChangeId{ Cid = 1});
              _context.SaveChanges();
          }else{
            Random rnd = new Random();
            int num = rnd.Next(1,100);
            changeid.Cid = num;
          }
          _context.SaveChanges();

          return utails;
         
        }

        [HttpGet("getUtails")]
        public Utlites getUtails()
        {
          try{
             return _context.Utlites.First();
         }catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
           }
        }

        




       
        
    }
}