using StackExchange.Redis;

namespace Messenger.API.Services.Redis;

public interface IRedisStreamService
{
    Task SendMessageAsync(string stream, NameValueEntry[] values);
}