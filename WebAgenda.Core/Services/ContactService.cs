using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Data;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Services
{
    public class ContactService : IContactService
    {
        private readonly WebAgendaContext _dbCtx;

        public ContactService(WebAgendaContext context)
        {
            _dbCtx = context;
        }

        public async Task<IEnumerable<Contact>> ListAllAsync()
        {
            return await _dbCtx.Contact.Include(p => p.PhoneNumbers).ToListAsync();
        }

        public async Task<Contact> FindById(int id)
        {
            return await _dbCtx.Contact.Include(p => p.PhoneNumbers)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Contact> FindByName(string name)
        {
            var contactFound = (from contact in _dbCtx.Contact
                                where contact.Name.Contains(name)
                                select new Contact()
                                {
                                    Id = contact.Id,
                                    Name = contact.Name,
                                    PhoneNumbers = (from pn in _dbCtx.PhoneNumber
                                                    where pn.ContactId == contact.Id
                                                    select pn).ToList()
                                }).FirstOrDefaultAsync();
            /*return await _dbCtx.Contact.Include(c => c.PhoneNumbers)
                .FirstOrDefaultAsync(c => c.Name.Contains(name));*/
            return await contactFound;
        }

        public async Task<Contact> SaveAsync(Contact contact)
        {
            _dbCtx.Contact.Add(contact);
            await _dbCtx.SaveChangesAsync();
            return contact;
        }

        public async Task<Contact> UpdateById(int id, Contact newContact)
        {
            Contact currentContact = await FindById(id);
            if (currentContact == null) return null;
            currentContact.Name = newContact.Name;
            if(newContact.PhoneNumbers.Count > 0)
            {
                currentContact.PhoneNumbers = newContact.PhoneNumbers;
            }
            _dbCtx.Update(currentContact);
            await _dbCtx.SaveChangesAsync();
            return currentContact;
        }

        public async Task DeleteByIdAsync(int id)
        {
            Contact contact = await FindById(id);
            if (contact == null) return;
            _dbCtx.Contact.Remove(contact);
            await _dbCtx.SaveChangesAsync();
        }
    }
}
