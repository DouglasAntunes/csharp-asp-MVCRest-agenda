using System.Collections.Generic;
using System.Threading.Tasks;
using WebAgenda.Core.DTO;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.Services
{
    public interface IPersonService
    {
        Task<IEnumerable<Person>> ListAllAsync();
        Task<Person> FindById(int id);
        Task<Person> SaveAsync(Person person);
        Task<Person> UpdateById(int id, Person newPerson);
        Task DeleteByIdAsync(int id);
    }
}
