using System.ComponentModel.DataAnnotations;

namespace Messenger.API.Models;

using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class Message
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string SenderId { get; set; } = null!;
    public User Sender { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;
    public User Receiver { get; set; } = null!;

    public string Content { get; set; } = null!;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
