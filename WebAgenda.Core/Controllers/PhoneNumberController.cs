using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Threading.Tasks;
using WebAgenda.Core.Models;
using WebAgenda.Core.Services;

namespace WebAgenda.Core.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhoneNumberController : ControllerBase
    {
        private readonly IPhoneNumberService _phoneNumberService;

        public PhoneNumberController(IPhoneNumberService phoneNumberService)
        {
            _phoneNumberService = phoneNumberService;
        }

        // GET api/<PhoneNumberController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhoneNumber>> GetAsync(int id) {
            PhoneNumber phoneNumber = await _phoneNumberService.FindById(id);
            if (phoneNumber == null) return NotFound();
            return phoneNumber;
        }
            
        // POST api/<PhoneNumberController>
        [HttpPost]
        public async Task<ActionResult<PhoneNumber>> PostAsync([FromBody] PhoneNumber phoneNumber)
        {
            await _phoneNumberService.SaveAsync(phoneNumber);
            return CreatedAtAction(nameof(GetAsync), new { id = phoneNumber.Id }, phoneNumber);
        }

        // PUT api/<PhoneNumberController>/5
        [HttpPut("{id}")]
        public async Task PutAsync(int id, [FromBody] PhoneNumber phoneNumber) => await _phoneNumberService.UpdateByIdAsync(id, phoneNumber);

        // DELETE api/<PhoneNumberController>/5
        [HttpDelete("{id}")]
        public async Task DeleteAsync(int id) => await _phoneNumberService.DeleteByIdAsync(id);
    }
}
