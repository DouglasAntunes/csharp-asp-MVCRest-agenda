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
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // GET: api/<PersonController>
        [HttpGet]
        public async Task<IEnumerable<ContactDT>> GetAsync()
        {
            IEnumerable<Contact> contactList = await _contactService.ListAllAsync();
            return contactList.ToList().ConvertAll(p => new ContactDT(p)).ToList();
        }

        // GET api/<PersonController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDT>> GetAsync(int id)
        {
            Contact contact = await _contactService.FindById(id);
            if (contact == null) return NotFound();
            return new ContactDT(contact);
        }

        // GET api/<PersonController>
        [HttpGet("find/{name}")]
        public async Task<ActionResult<ContactDT>> GetAsync(string name)
        {
            Contact contact = await _contactService.FindByName(name);
            if (contact == null) return NotFound();
            return new ContactDT(contact);
        }

        // POST api/<PersonController>
        [HttpPost]
        public async Task<ActionResult<ContactDT>> PostAsync([FromBody] ContactDT contactDT)
        {
            Contact contact = contactDT.ToContact();
            await _contactService.SaveAsync(contact);
            return CreatedAtAction(nameof(GetAsync), new { id = contact.Id }, new ContactDT(contact));
        }

        // PUT api/<PersonController>/5
        [HttpPut("{id}")]
        public async Task PutAsync(int id, [FromBody] ContactDT contact) {
            await _contactService.UpdateById(id, contact.ToContact());
        }

        // DELETE api/<PersonController>/5
        [HttpDelete("{id}")]
        public async Task DeleteAsync(int id) => await _contactService.DeleteByIdAsync(id);
    }
}
