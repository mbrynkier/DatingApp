using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.DTO;
using AutoMapper;
using System.Security.Claims;

namespace API.Controllers
{    
    [Authorize]
    public class UsersController : BaseApiController
    {
        
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            
        }

        [HttpGet]
        // api/users
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {   
            var users = await _userRepository.GetMembersAsync();

            return Ok(users);

        }
        // api/users/username
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);            
        }    

        // api/users pero con put
        [HttpPut] //Se usa para hacer un update
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; //Esto recupera el username
            var user = await _userRepository.GetUserByUsernameAsync(username); //aca buscamos el User con el username

            _mapper.Map(memberUpdateDto, user); //Aca nos ahorramos de mapear cada uno de los campos a actualizar

            _userRepository.Update(user); //Hace el update

            if(await _userRepository.SaveAllAsync()) return NoContent(); //Se fija que se alla guardado todas las modificaciones
            return BadRequest("Failed to update user"); //Esto se va a mostrar si hay un error al modificar el suuario

        }
    }
}