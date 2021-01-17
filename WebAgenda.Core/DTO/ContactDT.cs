using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.Models;

namespace WebAgenda.Core.DTO
{
    public class ContactDT
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ContactPhoneNumberDT> PhoneNumbers { get; set; }

        public ContactDT()
        {
        }

        public ContactDT(Contact contact)
        {
            Id = contact.Id;
            Name = contact.Name;
            PhoneNumbers = contact.PhoneNumbers.ToList()
                .ConvertAll(p => new ContactPhoneNumberDT { Id = p.Id, DDD = p.DDD, Number = p.Number })
                .ToList();
        }

        public Contact ToContact()
        {
            Contact contact = new Contact(Id, Name);
            if(PhoneNumbers != null && PhoneNumbers.Count > 0)
            {
                contact.PhoneNumbers = PhoneNumbers.ConvertAll(p => new PhoneNumber(p.Id, p.Number, p.DDD, contact)).ToList();
            }
            return contact;
        }
    }

    public partial class ContactPhoneNumberDT
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public short DDD { get; set; }
    }
}
