using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger.API.Migrations
{
    /// <inheritdoc />
    public partial class messages_persistent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    sender_id = table.Column<string>(type: "text", nullable: false),
                    receiver_id = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: true),
                    user_id1 = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_messages", x => x.id);
                    table.ForeignKey(
                        name: "fk_messages_asp_net_users_receiver_id",
                        column: x => x.receiver_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_messages_asp_net_users_sender_id",
                        column: x => x.sender_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_messages_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_messages_asp_net_users_user_id1",
                        column: x => x.user_id1,
                        principalTable: "AspNetUsers",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ix_messages_receiver_id",
                table: "messages",
                column: "receiver_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_sender_id",
                table: "messages",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_timestamp",
                table: "messages",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "ix_messages_user_id",
                table: "messages",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_user_id1",
                table: "messages",
                column: "user_id1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "messages");
        }
    }
}
