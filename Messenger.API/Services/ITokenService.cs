using System.IdentityModel.Tokens.Jwt;
using Messenger.API.Models;

namespace Messenger.API.Services;

public interface ITokenService
{
    JwtSecurityToken GenerateToken(User user);
    string RefreshToken(User user);
}