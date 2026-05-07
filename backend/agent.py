import psutil
import time
import datetime 
import socket
import sqlite3
import os
import threading
import requests


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
    
    conn.commit()
    conn.close()
    return(
        {
            "status": "success"
        }
    )
    
def get_metrics():
    data = {
        "host": HOSTNAME,
        "time": datetime.datetime.now(datetime.UTC).isoformat(),
        "cpu": psutil.cpu_percent(interval=None),
        "memory": psutil.virtual_memory()[2],
        "disk": psutil.disk_usage("/").percent,
        "load": psutil.getloadavg()[0]
    }

    conn = sqlite3.connect('metrics.db')
    cursor = conn.cursor()
    try:
        cursor.execute(''' INSERT OR REPLACE INTO metrics (host, last_update)
            VALUES (?, ?)''', (data["host"], data["time"]))

        cursor.execute(''' INSERT INTO metrics_data (host, time, cpu, memory, disk, load)
                       VALUES (?, ?, ?, ?, ?, ?)''', (data["host"], data["time"], data["cpu"], data["memory"], data["disk"], data["load"]))

        conn.commit()

    except Exception as e:
        print(f"DB error: {e}")
    finally:
        conn.close()

    return data

def main():
    create_db()
    while True:
        get_metrics()
        time.sleep(1)

if __name__ == "__main__":
    main()  
