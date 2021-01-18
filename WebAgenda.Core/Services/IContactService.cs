using System.Collections.Generic;
using System.Threading.Tasks;
using WebAgenda.Core.DTO;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Services
{
    public interface IContactService
    {
        Task<IEnumerable<Contact>> ListAllAsync();
        Task<Contact> FindById(int id);
        Task<Contact> FindByName(string name);
        Task<Contact> SaveAsync(Contact contact);
        Task<Contact> UpdateById(int id, Contact newContact);
        Task DeleteByIdAsync(int id);
    }
}
