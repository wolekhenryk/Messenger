using Messenger.API.Constats;
using Messenger.API.Models.Messages;
using Messenger.API.Services.SignalR;
using StackExchange.Redis;

namespace Messenger.API.Services.Redis;

public class DirectMessageStreamListener(IMessageService messageService) : IRedisStreamListener
{
    public string StreamKey => "dm-stream";
    public string ConsumerGroup => "dm-group";
    public string ConsumerName => "dm-service";
    
    public async Task HandleStreamEntry(StreamEntry streamEntry)
    {
        var from = streamEntry["from"];
        var to = streamEntry["to"];
        var content = streamEntry["content"];
        
        if (from.IsNull || to.IsNull || content.IsNull)
            return;
        
        var message = new DirectMessage(from, to, content);
        
        await messageService.SendMessageAsync(to, MessageTypes.DirectMessage, message);
    }
}