using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.DTO
{
    public class PersonDT
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<PersonPhoneNumberDT> PhoneNumbers { get; set; }

        public PersonDT()
        {
        }

        public PersonDT(Person person)
        {
            Id = person.Id;
            Name = person.Name;
            PhoneNumbers = person.PhoneNumbers.ToList()
                .ConvertAll(p => new PersonPhoneNumberDT { Id = p.Id, DDD = p.DDD, Number = p.Number })
                .ToList();
        }

        public Person ToPerson()
        {
            Person person = new Person(Id, Name);
            if(PhoneNumbers != null && PhoneNumbers.Count > 0)
            {
                person.PhoneNumbers = PhoneNumbers.ConvertAll(p => new PhoneNumber(p.Id, p.Number, p.DDD, person)).ToList();
            }
            return person;
        }
    }

    public partial class PersonPhoneNumberDT
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public short DDD { get; set; }
    }
}
