using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class RegisterDto
    {
        [Required]public string Username { get; set; }
        [Required] public string KnownAs { get; set; } //agregue esto porque modificamos el register
        [Required] public string Gender { get; set; } //agregue esto porque modificamos el register
        [Required] public DateTime DateOfBirth { get; set; } //agregue esto porque modificamos el register
        [Required] public string City { get; set; } //agregue esto porque modificamos el register
        [Required] public string Country { get; set; } //agregue esto porque modificamos el register

        [Required]
        [StringLength(8 , MinimumLength = 4)]
        public string Password { get; set; }
    }
}