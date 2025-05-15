using Messenger.API.Data;
using Messenger.API.Models;
using Messenger.API.Utility;
using Microsoft.EntityFrameworkCore;

namespace Messenger.API.Repositories;

public interface IMessageRepository
{
    Task<Optional<IEnumerable<Message>>> GetMessagesBetweenUsersAsync(
        string userAId,
        string userBId,
        DateTime? beforeCursor = null,
        int limit = 50);
    
    Task<Optional<Message>> AddMessageAsync(Message message);
}

public class MessageRepository(AppDbContext dbContext) : IMessageRepository
{
    public async Task<Optional<IEnumerable<Message>>> GetMessagesBetweenUsersAsync(string userAId, string userBId, DateTime? beforeCursor = null, int limit = 50)
    {
        try
        {
            var query = dbContext.Messages
                .AsNoTracking()
                .Where(m =>
                    (m.SenderId == userAId && m.ReceiverId == userBId) ||
                    (m.SenderId == userBId && m.ReceiverId == userAId));

            if (beforeCursor.HasValue)
            {
                query = query.Where(m => m.Timestamp < beforeCursor.Value);
            }

            var result = await query
                .OrderByDescending(m => m.Timestamp)
                .Take(limit)
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .ToListAsync();

            return Optional<IEnumerable<Message>>.Success(result);
        }
        catch (Exception ex)
        {
            return Optional<IEnumerable<Message>>.Failure(ex.Message);
        }
    }

    public async Task<Optional<Message>> AddMessageAsync(Message message)
    {
        try
        {
            var result = await dbContext.AddAsync(message);
            await dbContext.SaveChangesAsync();

            return Optional<Message>.Success(message);
        }
        catch (Exception ex)
        {
            return Optional<Message>.Failure(ex.Message);
        }
    }
}