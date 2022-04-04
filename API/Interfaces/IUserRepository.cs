using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        // Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUserAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);

        //Task<IEnumerable<MemberDto>> GetMembersAsync(); //se comento porque se agrego paginacion
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams); //Se agrego Paginacion
        Task<MemberDto> GetMemberAsync(string username);

        Task<string> GetUserGender(string username);
    }
}