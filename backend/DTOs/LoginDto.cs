using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class LoginDto
    {
        public string username { get; set; }
        [Required]
        public string email { get; set; }
        public string image { get; set; }
    }
}