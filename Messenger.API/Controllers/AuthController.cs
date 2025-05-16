using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Messenger.API.Models;
using Messenger.API.Models.Jwt;
using Messenger.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Messenger.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<User> userManager,
    ITokenService tokenService,
    IConfiguration configuration) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var user = new User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            UserName = registerDto.Email,
            Email = registerDto.Email,
        };
        
        var result = await userManager.CreateAsync(user, registerDto.Password);
        
        return result.Succeeded 
            ? Ok() 
            : BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user is null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
            return Unauthorized("Invalid credentials.");

        var token = tokenService.GenerateToken(user);
        var refreshToken = tokenService.RefreshToken(user);
        
        return Ok(new TokenResult
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            RefreshToken = refreshToken,
        });
    }

    // [HttpGet("me")]
    // [Authorize]
    // public async Task<IActionResult> GetMe()
    // {
    //     var user = await userManager.GetUserAsync(User);
    //     return Ok(user);
    // }
    
    [Authorize]
    [HttpPost("validate")]
    public IActionResult Validate([FromBody] ValidateTokenDto tokenDto)
    {
        var tokenHandler = new JwtSecurityTokenHandler
        {
            MapInboundClaims = false
        };

        var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);

        try
        {
            tokenHandler.ValidateToken(tokenDto.Token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                RoleClaimType = ClaimTypes.Role,
                NameClaimType = JwtRegisteredClaimNames.Sub
            }, out var validatedToken);

            return Ok(new TokenValidationResponse()
            {
                Valid = true
            });
        }
        catch (SecurityTokenExpiredException)
        {
            return Unauthorized(new TokenValidationResponse { Valid = false, Error = "Token expired" });
        }
        catch (SecurityTokenException)
        {
            return Unauthorized(new TokenValidationResponse { Valid = false, Error = "Invalid token" });
        }
    }

    
    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshTokenRequest tokenRequest)
    {
        var tokenHandler = new JwtSecurityTokenHandler
        {
            MapInboundClaims = false
        };
        var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);

        try
        {
            var principal = tokenHandler.ValidateToken(tokenRequest.RefreshToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                RoleClaimType = ClaimTypes.Role,
                NameClaimType = JwtRegisteredClaimNames.Sub
            }, out var validatedToken);

            var typeClaim = principal.FindFirst("type")?.Value;
            if (typeClaim != "refresh")
                return Unauthorized("Invalid token type");

            var userId = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null)
                return Unauthorized();

            var user = userManager.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return Unauthorized();

            var newAccessToken = tokenService.GenerateToken(user);
            var newRefreshToken = tokenService.RefreshToken(user);

            return Ok(new TokenResult
            {
                Token = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                RefreshToken = newRefreshToken
            });
        }
        catch (SecurityTokenException)
        {
            return Unauthorized("Invalid refresh token");
        }
    }
}