using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class AddressDto
    {
       public string Phone { get; set; }
       public string UserAddress { get; set; }
       public int DistrictId { get; set; }
       public string District { get; set; }
       public int UpazilaId { get; set; }
       public string Upazila { get; set; } 
       
    }
}