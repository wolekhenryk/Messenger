namespace Messenger.API.Models.Messages;

public record DirectMessage(string From, string To, string Content);