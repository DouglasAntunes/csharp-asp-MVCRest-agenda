using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAgenda.Core.Models
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<PhoneNumber> PhoneNumbers = new List<PhoneNumber>();

        public Person()
        {
        }

        public Person(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
