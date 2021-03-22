using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace WebAgenda.Test.IT
{
    class IntegrationTest
    {
        protected readonly HttpClient TestClient;

        public IntegrationTest()
        {
            WebApplicationFactory<Core.Startup> appFactory = new WebApplicationFactory<WebAgenda.Core.Startup>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<WebAgenda.Core.Data.WebAgendaContext>));
                        if (descriptor != null) services.Remove(descriptor);
                        services.AddDbContext<WebAgenda.Core.Data.WebAgendaContext>(options =>
                        {
                            options.UseInMemoryDatabase("TestDb");
                        });
                    });
                });

            TestClient = appFactory.CreateClient();
        }
    }
}
