using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Address
    {

       public int Id { get; set; }
       public string Phone { get; set; }
       public string UserAddress { get; set; }
       public int DistrictId { get; set; }
       public string District { get; set; }
       public int UpazilaId { get; set; }
       public string Upazila { get; set; } 
       public int AppUserId { get; set; }
       public AppUser AppUser { get; set; } 
    }
}