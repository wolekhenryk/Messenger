using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger.API.Migrations
{
    /// <inheritdoc />
    public partial class user_first_and_last_names : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "first_name",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "last_name",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "first_name",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "last_name",
                table: "AspNetUsers");
        }
    }
}
