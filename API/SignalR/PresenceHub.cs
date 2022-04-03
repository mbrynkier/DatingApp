using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var isOnline = await _tracker.UserConnected(Context.User.GetUserName(), Context.ConnectionId); //agrego al usuario conectado a la lista de conectados
            if(isOnline)
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserName()); //aviso a todos los usuarios que esta conectado

            var currentUsers = await _tracker.GetOnlineUsers(); //me guardo la lista actual de todos los usuarios online
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers); //Le envio la lista a todos los usuarios.
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isOffline = await _tracker.UserDisconnected(Context.User.GetUserName(), Context.ConnectionId); //borro al usuario conectado a la lista de conectados

            if(isOffline)
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUserName());// aviso a todos los usuarios que se desconecto

            await base.OnDisconnectedAsync(exception);
        }
    }
}

//Esto lo agregamos en StartUp y IdentityServicesExtensions
//Se creo un service llamado presence.service.ts