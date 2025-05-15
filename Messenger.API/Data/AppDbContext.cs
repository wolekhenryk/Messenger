using Messenger.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Messenger.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Message> Messages { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Message>()
            .HasIndex(m => m.Timestamp);

        builder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany()
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}