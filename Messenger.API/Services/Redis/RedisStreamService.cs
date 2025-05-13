using StackExchange.Redis;

namespace Messenger.API.Services.Redis;

public class RedisStreamService(IConnectionMultiplexer redis) : IRedisStreamService
{
    private readonly IDatabase _database = redis.GetDatabase();
    
    public async Task SendMessageAsync(string stream, NameValueEntry[] values) =>
        await _database.StreamAddAsync(stream, values);
}