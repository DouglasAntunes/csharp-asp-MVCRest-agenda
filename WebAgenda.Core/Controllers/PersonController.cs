using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAgenda.Core.DTO;
using WebAgenda.Core.Models;
using WebAgenda.Core.Services;

namespace WebAgenda.Core.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly IPersonService _personService;

        public PersonController(IPersonService personService)
        {
            _personService = personService;
        }

        // GET: api/<PersonController>
        [HttpGet]
        public async Task<IEnumerable<PersonDT>> GetAsync()
        {
            IEnumerable<Person> personList = await _personService.ListAllAsync();
            return personList.ToList().ConvertAll(p => new PersonDT(p)).ToList();
        }

        // GET api/<PersonController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonDT>> GetAsync(int id)
        {
            Person person = await _personService.FindById(id);
            if (person == null) return NotFound();
            return new PersonDT(person);
        }

        // POST api/<PersonController>
        [HttpPost]
        public async Task<ActionResult<PersonDT>> PostAsync([FromBody] PersonDT personDT)
        {
            Person person = personDT.ToPerson();
            await _personService.SaveAsync(person);
            return CreatedAtAction(nameof(GetAsync), new { id = person.Id }, new PersonDT(person));
        }

        // PUT api/<PersonController>/5
        [HttpPut("{id}")]
        public async Task PutAsync(int id, [FromBody] PersonDT person) {
            await _personService.UpdateById(id, person.ToPerson());
        }

        // DELETE api/<PersonController>/5
        [HttpDelete("{id}")]
        public async Task DeleteAsync(int id) => await _personService.DeleteByIdAsync(id);
    }
}
