using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Data;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Services
{
    public class PhoneNumberService : IPhoneNumberService
    {
        private readonly WebAgendaContext _dbCtx;

        public PhoneNumberService(WebAgendaContext context)
        {
            _dbCtx = context;
        }

        public Task<PhoneNumber> FindById(int id)
        {
            return _dbCtx.PhoneNumber.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PhoneNumber> SaveAsync(PhoneNumber phoneNumber)
        {
            _dbCtx.PhoneNumber.Add(phoneNumber);
            await _dbCtx.SaveChangesAsync();
            return phoneNumber;
        }

        public async Task<PhoneNumber> UpdateByIdAsync(int id, PhoneNumber newPhone)
        {
            PhoneNumber phoneNumber = await FindById(id);
            if (phoneNumber == null) return null;
            phoneNumber.DDD = newPhone.DDD;
            phoneNumber.Number = newPhone.Number;
            phoneNumber.Person = newPhone.Person;
            _dbCtx.Update(phoneNumber);
            await _dbCtx.SaveChangesAsync();
            return phoneNumber;
        }

        public async Task DeleteByIdAsync(int id)
        {
            PhoneNumber phoneNumber = await FindById(id);
            if (phoneNumber == null) return;
            _dbCtx.PhoneNumber.Remove(phoneNumber);
            await _dbCtx.SaveChangesAsync();
        }
    }
}
