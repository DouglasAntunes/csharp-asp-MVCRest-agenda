using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Data
{
    public class WebAgendaContext : DbContext
    {
        public WebAgendaContext(DbContextOptions<WebAgendaContext> options) : base(options)
        { 
        }

        public DbSet<Contact> Contact { get; set; }
        public DbSet<PhoneNumber> PhoneNumber { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Contact>()
                .HasMany(p => p.PhoneNumbers)
                .WithOne(p => p.Contact)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
