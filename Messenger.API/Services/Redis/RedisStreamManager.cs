using StackExchange.Redis;

namespace Messenger.API.Services.Redis
{
    public class RedisStreamManager(
        IServiceScopeFactory scopeFactory,
        IConnectionMultiplexer redis,
        ILogger<RedisStreamManager> logger)
        : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var db = redis.GetDatabase();

            // Loop to restart listeners every interval or reconnect
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = scopeFactory.CreateScope();
                var listeners = scope.ServiceProvider.GetServices<IRedisStreamListener>();

                foreach (var listener in listeners)
                {
                    try
                    {
                        if (!await db.KeyExistsAsync(listener.StreamKey))
                            await db.StreamAddAsync(listener.StreamKey, "init", "0");

                        try
                        {
                            await db.StreamCreateConsumerGroupAsync(
                                listener.StreamKey,
                                listener.ConsumerGroup,
                                "0-0",
                                true);
                        }
                        catch (RedisServerException ex) when (ex.Message.Contains("BUSYGROUP"))
                        {
                            // Consumer group already exists
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, $"Error initializing stream {listener.StreamKey}");
                    }
                }

                // Read from streams
                foreach (var listener in listeners)
                {
                    try
                    {
                        var entries = await db.StreamReadGroupAsync(
                            listener.StreamKey,
                            listener.ConsumerGroup,
                            listener.ConsumerName,
                            ">");

                        foreach (var entry in entries)
                        {
                            await listener.HandleStreamEntry(entry);
                            await db.StreamAcknowledgeAsync(
                                listener.StreamKey,
                                listener.ConsumerGroup,
                                entry.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, $"Error in stream {listener.StreamKey}");
                    }
                }

                await Task.Delay(500, stoppingToken);
            }
        }
    }
}
