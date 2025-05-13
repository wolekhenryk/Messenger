using Messenger.API.Models.Messages;
using Messenger.API.Services.Redis;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace Messenger.API.Services.SignalR;

[Authorize]
public class MessageHub(
    IConnectedClientManager clientManager,
    IRedisStreamService redisStreamService) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier ?? string.Empty;
        var connectionId = Context.ConnectionId;
        clientManager.AddClient(userId, connectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        clientManager.RemoveClient(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendDirectMessage(SendMessageRequest request)
    {
        var fromUserId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(fromUserId) || string.IsNullOrWhiteSpace(request.ToUserId) || string.IsNullOrWhiteSpace(request.Content))
            return;

        var entries = new[]
        {
            new NameValueEntry("from", fromUserId),
            new NameValueEntry("to", request.ToUserId),
            new NameValueEntry("content", request.Content)
        };

        await redisStreamService.SendMessageAsync("dm-stream", entries);
    }
}