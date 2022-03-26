using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class UserDto
    {
        public string Username { get; set; }

        public string Token { get; set; }
        public string PhotoUrl { get; set; } //se agrego asi al logearse devuelve la foto, lo agrego en AccountController y User.ts
        public string KnownAs { get; set; }
        public string Gender { get; set; }
        
    }
}