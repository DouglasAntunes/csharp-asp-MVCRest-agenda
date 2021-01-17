using Microsoft.EntityFrameworkCore.Migrations;

namespace WebAgenda.Core.Migrations
{
    public partial class ChangeRelations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhoneNumber_Person_PersonId",
                table: "PhoneNumber");

            migrationBuilder.AddForeignKey(
                name: "FK_PhoneNumber_Person_PersonId",
                table: "PhoneNumber",
                column: "PersonId",
                principalTable: "Person",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhoneNumber_Person_PersonId",
                table: "PhoneNumber");

            migrationBuilder.AddForeignKey(
                name: "FK_PhoneNumber_Person_PersonId",
                table: "PhoneNumber",
                column: "PersonId",
                principalTable: "Person",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
