using Microsoft.AspNetCore.Identity;

namespace Messenger.API.Models;

public class User : IdentityUser
{
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    
}