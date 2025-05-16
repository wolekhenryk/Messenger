namespace Messenger.API.Models.Jwt;

public class TokenResult
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
}