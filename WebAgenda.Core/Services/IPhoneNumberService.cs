using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Services
{
    public interface IPhoneNumberService
    {
        Task<PhoneNumber> FindById(int id);
        Task<PhoneNumber> SaveAsync(PhoneNumber phoneNumber);
        Task<PhoneNumber> UpdateByIdAsync(int id, PhoneNumber newPhone);
        Task DeleteByIdAsync(int id);
    }
}
