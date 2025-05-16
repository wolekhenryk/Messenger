namespace Messenger.API.Models.Jwt;

public class TokenValidationResponse
{
    public bool Valid { get; set; }
    public string? Error { get; set; }
}