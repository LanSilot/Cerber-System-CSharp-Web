using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PresentationWebApp.Startup))]
namespace PresentationWebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
