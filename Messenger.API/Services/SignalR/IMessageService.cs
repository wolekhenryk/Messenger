namespace Messenger.API.Services.SignalR;

public interface IMessageService
{
    Task SendMessageAsync<T>(string userId, string method, T message, CancellationToken cancellationToken = default);
}