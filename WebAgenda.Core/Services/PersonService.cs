using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Data;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Services
{
    public class PersonService : IPersonService
    {
        private readonly WebAgendaContext _dbCtx;

        public PersonService(WebAgendaContext context)
        {
            _dbCtx = context;
        }

        public async Task<IEnumerable<Person>> ListAllAsync()
        {
            return await _dbCtx.Person.Include(p => p.PhoneNumbers).ToListAsync();
        }

        public async Task<Person> FindById(int id)
        {
            return await _dbCtx.Person.Include(p => p.PhoneNumbers)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Person> SaveAsync(Person person)
        {
            _dbCtx.Person.Add(person);
            await _dbCtx.SaveChangesAsync();
            return person;
        }

        public async Task<Person> UpdateById(int id, Person newPerson)
        {
            Person person = await FindById(id);
            if (person == null) return null;
            person.Name = newPerson.Name;
            if(newPerson.PhoneNumbers.Count > 0)
            {
                person.PhoneNumbers = newPerson.PhoneNumbers;
            }
            _dbCtx.Update(person);
            await _dbCtx.SaveChangesAsync();
            return person;
        }

        public async Task DeleteByIdAsync(int id)
        {
            Person person = await FindById(id);
            if (person == null) return;
            _dbCtx.Person.Remove(person);
            await _dbCtx.SaveChangesAsync();
        }
    }
}
