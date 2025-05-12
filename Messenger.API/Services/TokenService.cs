using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Messenger.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace Messenger.API.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public JwtSecurityToken GenerateTokenAsync(User user)
    {
        Claim[] claims = 
        [
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        ];

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(configuration["Jwt:ExpiresInMinutes"]!)),
            signingCredentials: creds
        );
        
        return token;
    }

    public string RefreshTokenAsync(User user) => 
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
}