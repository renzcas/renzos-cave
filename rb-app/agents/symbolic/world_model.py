
world = {
    "entrance":(50,50),
    "lab1":(150,150),
    "lab2":(300,150),
    "lab3":(450,150),
    "lab4":(600,150),
    "volcano":(350,300),
    "transport":(350,450)
}

agent_pos = world["entrance"]

def render_world(canvas):
    canvas.delete("all")
    for name,(x,y) in world.items():
        canvas.create_oval(x-10,y-10,x+10,y+10, fill="white")
        canvas.create_text(x,y-20,text=name,fill="white")

    ax,ay = agent_pos
    canvas.create_oval(ax-8,ay-8,ax+8,ay+8, fill="yellow")
    canvas.create_text(ax,ay-20,text="agent",fill="yellow")

def move_to(name, canvas):
    global agent_pos
    agent_pos = world[name]
    render_world(canvas)
