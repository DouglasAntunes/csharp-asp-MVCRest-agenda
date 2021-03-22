using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebAgenda.Core.DTO;

namespace WebAgenda.Test.IT
{
    class ContactControllerTests : IntegrationTest
    {
        [Test]
        public async Task GetAll_WithoutAnyNumbers_ReturnsEmptyResponse()
        {
            var response = await TestClient.GetAsync("https://localhost/api/Contact/");

            var responseDataList = JsonConvert.DeserializeObject<IEnumerable<ContactDT>>(await response.Content.ReadAsStringAsync());

            (response.StatusCode).Should().Be(HttpStatusCode.OK);
            responseDataList.Should().BeEmpty();
        } 
    }
}
