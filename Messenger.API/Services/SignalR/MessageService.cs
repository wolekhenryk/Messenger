using Microsoft.AspNetCore.SignalR;

namespace Messenger.API.Services.SignalR;

public class MessageService(IHubContext<MessageHub> hubContext, IConnectedClientManager clientManager) : IMessageService
{
    public async Task SendMessageAsync<T>(string userId, string method, T message, CancellationToken cancellationToken = default)
    {
        var connections = clientManager.GetConnectionIds(userId);
        var tasks = connections.Select(connectionId =>
            hubContext.Clients.Client(connectionId).SendAsync(method, message, cancellationToken));
        await Task.WhenAll(tasks);
    }
}