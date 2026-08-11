
import random

agent_state = {
    "attention":0.0,
    "spike":0.0,
    "entropy":0.0
}

def heartbeat_update(log):
    agent_state["attention"] = random.uniform(0.1,0.9)
    agent_state["spike"] = random.uniform(5,40)
    agent_state["entropy"] = random.uniform(0.1,0.9)

    log.delete("1.0","end")
    log.insert("end", f"Attention: {agent_state['attention']:.2f}\n")
    log.insert("end", f"Spike: {agent_state['spike']:.2f}\n")
    log.insert("end", f"Entropy: {agent_state['entropy']:.2f}\n")

    log.after(1000, lambda: heartbeat_update(log))
