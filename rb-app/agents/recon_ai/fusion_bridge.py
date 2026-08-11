
import random

agent = {
    "pos":[50,50],
    "attention":0.0,
    "entropy":0.0,
    "tasks":[]
}

def fusion_tick():
    agent["attention"] = random.uniform(0.1,0.9)
    agent["entropy"] = random.uniform(0.1,0.9)
    agent["pos"][0] += random.randint(-5,5)
    agent["pos"][1] += random.randint(-5,5)

def fusion_loop(log):
    log.insert("end","\n=== FUSION START ===\n")
    for i in range(10):
        fusion_tick()
        log.insert("end", f"Tick {i+1}: pos={agent['pos']} att={agent['attention']:.2f} ent={agent['entropy']:.2f}\n")
    log.insert("end","=== FUSION END ===\n")
