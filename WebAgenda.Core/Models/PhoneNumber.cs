namespace WebAgenda.Core.Models
{
    public class PhoneNumber
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public short DDD { get; set; }
        public int? PersonId { get; set; }
        public virtual Person Person { get; set; }

        public PhoneNumber()
        {
        }

        public PhoneNumber(int id, int number, short dDD, Person person)
        {
            Id = id;
            Number = number;
            DDD = dDD;
            Person = person;
        }
    }
}
