using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);
        Task<AppUser> GetUserWithLikes(int likedUserId);
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}

//Se usa es LikesRepository y ApplicationServiceExtension