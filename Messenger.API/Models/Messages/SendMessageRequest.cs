namespace Messenger.API.Models.Messages;

public record SendMessageRequest(string ToUserId, string Content);
