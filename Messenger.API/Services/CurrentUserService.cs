using System.Security.Claims;

namespace Messenger.API.Services;

public class CurrentUserService(IHttpContextAccessor accessor) : ICurrentUserService
{
    public string UserId => accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)!;
    public ClaimsPrincipal User => accessor.HttpContext?.User!;
}