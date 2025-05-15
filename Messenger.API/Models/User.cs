using Microsoft.AspNetCore.Identity;

namespace Messenger.API.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public ICollection<Message> SentMessages { get; set; }
    public ICollection<Message> ReceivedMessages { get; set; }
}