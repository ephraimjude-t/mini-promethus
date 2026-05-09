import psutil
import time
import datetime 
import socket
import sqlite3
import os
import threading
import subprocess

HOSTNAME = os.getenv("HOSTNAME", socket.gethostname())

def create_db():
    conn = sqlite3.connect('metrics.db')
    cursor = conn.cursor()
    cursor.execute(''' PRAGMA foreign_keys = ON ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host TEXT UNIQUE NOT NULL,
            last_update DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS metrics_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host TEXT NOT NULL,
            time DATETIME NOT NULL,
            cpu FLOAT NOT NULL,
            memory FLOAT NOT NULL,
            disk FLOAT NOT NULL,
            load FLOAT NOT NULL,
            FOREIGN KEY (host) REFERENCES metrics(host) ON DELETE CASCADE
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host TEXT NOT NULL,
            time DATETIME NOT NULL,
            message TEXT NOT NULL,
            FOREIGN KEY (host) REFERENCES metrics(host) ON DELETE CASCADE
        )
    ''')
    conn.commit()
    conn.close()

def get_metrics():
    data = {
        "host": HOSTNAME,
        "time": datetime.datetime.now(datetime.UTC).isoformat(),
        "cpu": psutil.cpu_percent(interval=None),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage("/").percent,
        "load": psutil.getloadavg()[0]
    }

    conn = sqlite3.connect('metrics.db')
    cursor = conn.cursor()
    try:
        cursor.execute(''' INSERT OR REPLACE INTO metrics (host, last_update)
            VALUES (?, ?)''', (data["host"], data["time"]))

        cursor.execute(''' INSERT INTO metrics_data (host, time, cpu, memory, disk, load)
                       VALUES (?, ?, ?, ?, ?, ?)''', 
                       (data["host"], data["time"], data["cpu"], data["memory"], data["disk"], data["load"]))
        conn.commit()
    except Exception as e:
        print(f"Metrics DB error: {e}")
    finally:
        conn.close()

def get_logs():
    # 1. Start the process
    process = subprocess.Popen(
        ["journalctl", "-p", "warning", "-f", "-n", "50", "--output", "short-iso"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1 
    )

    conn = sqlite3.connect('metrics.db')
    cursor = conn.cursor()

    try:
        for line in iter(process.stdout.readline, ''):
            line = line.strip()
            if not line:
                continue

            timestamp = datetime.datetime.now(datetime.UTC).isoformat()
            
            try:
                cursor.execute(''' 
                    INSERT INTO logs (host, time, message)
                    VALUES (?, ?, ?)
                ''', (HOSTNAME, timestamp, line))
                conn.commit()
            except sqlite3.Error as e:
                print(f"Database insertion error: {e}")

    except KeyboardInterrupt:
        print("Stopping log collection...")
    finally:
        process.terminate()
        conn.close()

def main():
    create_db()
    log_thread = threading.Thread(target=get_logs, daemon=True)
    log_thread.start()

    print(f"Monitoring started on {HOSTNAME}...")
    
    while True:
        get_metrics()
        time.sleep(1)

if __name__ == "__main__":
    main()