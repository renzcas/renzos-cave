using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace CaveSharpBridge.Controllers
{
    [ApiController]
    [Route("engine")]
    public class EngineController : ControllerBase
    {
        [HttpGet("state")]
        public IActionResult GetState()
        {
            var packet = new
            {
                tick = Engine.Tick,
                heat = Engine.Heat,
                archetype = Engine.Archetype,
                regions = Engine.Regions.Select(r => new {
                    x = r.X,
                    y = r.Y,
                    z = r.Z,
                    s = r.Stress
                })
            };

            return Ok(packet);
        }
    }
}
