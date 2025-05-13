using StackExchange.Redis;

namespace Messenger.API.Services.Redis;

public interface IRedisStreamListener
{
    string StreamKey { get; }
    string ConsumerGroup { get; }
    string ConsumerName { get; }
    
    Task HandleStreamEntry(StreamEntry streamEntry);
}