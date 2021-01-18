using Newtonsoft.Json;

namespace WebAgenda.Core.Models
{
    public class PhoneNumber
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public short DDD { get; set; }
        public int? ContactId { get; set; }
        [JsonIgnore]
        public virtual Contact Contact { get; set; }

        public PhoneNumber()
        {
        }

        public PhoneNumber(int id, int number, short dDD, Contact contact)
        {
            Id = id;
            Number = number;
            DDD = dDD;
            Contact = contact;
        }
    }
}
