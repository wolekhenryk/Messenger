using System.Security.Claims;

namespace Messenger.API.Services;

public interface ICurrentUserService
{
    string UserId { get; }
    ClaimsPrincipal User { get; }
}