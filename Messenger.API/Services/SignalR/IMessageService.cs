using Messenger.API.Models.Messages;

namespace Messenger.API.Services.SignalR;

public interface IMessageService
{
    Task SendChatMessage(string toUserId, DirectMessage message);
    Task SendMessageAsync<T>(string userId, string method, T message, CancellationToken cancellationToken = default);
}