using Messenger.API.Models.Messages;
using Messenger.API.Repositories;
using Microsoft.AspNetCore.SignalR;
using Message = Messenger.API.Models.Message;
using MessageTypes = Messenger.API.Constats.MessageTypes;

namespace Messenger.API.Services.SignalR;

public class MessageService(
    IHubContext<MessageHub> hubContext,
    IConnectedClientManager clientManager,
    IMessageRepository messageRepository) : IMessageService
{
    public async Task SendChatMessage(string toUserId, DirectMessage message)
    {
        await messageRepository.AddMessageAsync(new Message
        {
            SenderId = message.From,
            ReceiverId = toUserId,
            Content = message.Content
        });
        await SendMessageAsync(toUserId, MessageTypes.DirectMessage, message);
    }

    public async Task SendMessageAsync<T>(string userId, string method, T message, CancellationToken cancellationToken = default)
    {
        var connections = clientManager.GetConnectionIds(userId);
        var tasks = connections.Select(connectionId =>
            hubContext.Clients.Client(connectionId).SendAsync(method, message, cancellationToken));
        await Task.WhenAll(tasks);
    }
}