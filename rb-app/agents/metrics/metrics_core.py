
import psutil

def refresh_system_panel(log):
    log.delete("1.0","end")

    cpu = psutil.cpu_percent()
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()

    log.insert("end", f"CPU: {cpu}%\n")
    log.insert("end", f"RAM: {mem.percent}%\n")
    log.insert("end", f"Disk: {disk.percent}%\n")
    log.insert("end", f"Sent: {net.bytes_sent}\n")
    log.insert("end", f"Recv: {net.bytes_recv}\n")
