// backend-csharp/Program.cs (minimal API hosting CaveSharp)
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<EngineState>();

var app = builder.Build();

app.MapGet("/engine/state", (EngineState engine) =>
{
    var packet = new
    {
        tick = engine.Tick,
        heat = engine.Heat,
        archetype = engine.Archetype,
        regions = engine.Regions.Select(r => new {
            x = r.X,
            y = r.Y,
            z = r.Z,
            s = r.Stress
        })
    };

    return Results.Json(packet);
});

app.MapPost("/engine/command", async (EngineState engine, HttpRequest req) =>
{
    using var doc = await JsonDocument.ParseAsync(req.Body);
    var cmd = doc.RootElement.GetProperty("command").GetString();

    engine.ApplyCommand(cmd ?? string.Empty);

    return Results.Ok(new { status = "ok", command = cmd });
});

app.Run();

public class EngineState
{
    public long Tick { get; private set; } = 0;
    public double Heat { get; private set; } = 0.0;
    public string Archetype { get; private set; } = "default";

    public List<Region> Regions { get; } = new();

    public void ApplyCommand(string cmd)
    {
        Tick++;

        switch (cmd)
        {
            case "boost":
                Heat += 0.1;
                Archetype = "Dragon";
                break;
            case "pulse":
                Heat += 0.05;
                Archetype = "Phoenix";
                break;
            case "stabilize":
                Heat *= 0.8;
                Archetype = "Bear";
                break;
        }

        Regions.Clear();
        var rand = new Random();
        for (int i = 0; i < 40; i++)
        {
            Regions.Add(new Region
            {
                X = rand.NextDouble() * 4 - 2,
                Y = rand.NextDouble() * 4 - 2,
                Z = rand.NextDouble() * 4 - 2,
                Stress = rand.NextDouble()
            });
        }
    }
}

public class Region
{
    public double X { get; set; }
    public double Y { get; set; }
    public double Z { get; set; }
    public double Stress { get; set; }
}
