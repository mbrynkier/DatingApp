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
using API.Extensions;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Microsoft.AspNetCore.Authentication;
using CloudinaryDotNet.Actions;
using API.Helpers;

namespace API.Controllers
{    
    [Authorize]
    public class UsersController : BaseApiController
    {
        

        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
         private readonly IUnitOfWork _unitOfWork;

        public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            
        }

        [HttpGet]
        // api/users
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {   
            var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUserName());
            userParams.CurrentUsername = User.GetUserName();
            
            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender =  gender == "male" ? "female" : "male";
            }

            var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages); //esto es para paginar, se agrega Headers

            return Ok(users);

        }
        // api/users/username
        [HttpGet("{username}", Name = "GetUser")] //Name es nombrarlo para poder usarlo para agregar la foto
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _unitOfWork.UserRepository.GetMemberAsync(username);            
        }    

        // api/users pero con put
        [HttpPut] //Se usa para hacer un update
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; //Esto recupera el username
            var username = User.GetUserName(); //Borramos lo de arriba porque creamos un ClaimsPrincipleExtension
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username); //aca buscamos el User con el username

            _mapper.Map(memberUpdateDto, user); //Aca nos ahorramos de mapear cada uno de los campos a actualizar

            _unitOfWork.UserRepository.Update(user); //Hace el update

            if(await _unitOfWork.Complete()) return NoContent(); //Se fija que se alla guardado todas las modificaciones
            return BadRequest("Failed to update user"); //Esto se va a mostrar si hay un error al modificar el suuario

        }

        //Para agregar photos!
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName()); //Recupero el usuario

            var result = await _photoService.AddPhotoAsync(file); //guarda el resultado de pasarle la foto

            if (result.Error != null) return BadRequest(result.Error.Message); //Si el error no viene vacio devolver un bad request

            var photo = new Photo //Creo una variable photo y le asigno la Url y el PublicId  del resultado
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0) //Si no tiene ninguna foto cargada esta sera el main photo
            {
                photo.IsMain = true;                
            }

            user.Photos.Add(photo); //Le agrego la photo al usuario

            if(await _unitOfWork.Complete()) //guardo la photo en la base de dato
            {
                //return _mapper.Map<PhotoDto>(photo); //devuelvo un mapper del PhotoDto. Mapea el photo DTO con la variable photo
                return CreatedAtRoute("GetUser", new{username = user.UserName}, _mapper.Map<PhotoDto>(photo)); //Se hizo de esta manera asi devuelve un 201 created en el status
                //El new es porque pide un objeto y le pasamos el username ya que el get user tiene que recibir un username              
            }
            return BadRequest("Problem adding photo"); //Devuelvo este error si no lo llega agregar
        }

        [HttpPut("set-main-photo/{photoId}")] //Esto es para elegir la main photo.
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName()); //Busco el usuario

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId); //busco la photo por id
            if (photo.IsMain) return BadRequest("This is already your main photo"); //Si la foto ya es main tiro un error

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain); //busco la photo que ya es main
            if (currentMain != null) currentMain.IsMain = false; //hago que el current main sea false
            photo.IsMain = true; //pongo la foto elegida para que sea main

            if(await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")] //aca es donde vamos a borrar la foto
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName()); //Busco el usuario
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId); //busco la foto
            if (photo == null) return NotFound(); //si devuelve vacio retorno no encontrado
            if(photo.IsMain) return BadRequest("You cannot delete your main photo"); //me fijo que no sea main 
            if(photo.PublicId != null) //me fijo que el publicId no sea null, ya que eso lo usa para borrar de cloudinary
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId); //Borra la foto the cloudinary
                if(result.Error != null) return BadRequest(result.Error.Message); //nos fijamos si la borro bien
            }

            user.Photos.Remove(photo); //remuevo la foto del user
            if(await _unitOfWork.Complete()) return Ok(); //Guardo los cambios y le borro la foto

            return BadRequest("Failed to delete the photo");
        }

    }
}