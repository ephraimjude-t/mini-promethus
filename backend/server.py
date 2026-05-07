from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import asyncio


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_NAME = "metrics.db"
metrics_store = []

def get_db_conn():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def welcome():
    return {
        "list_of_endpoints": {
            "system_stats": "/metrics",
            "websocket": "/ws/metrics/{host}"
        }
    }

@app.get('/metrics/{hostname}')
def show_metrics(hostname: str, limit: int = 50):
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT cpu, memory, disk, load, time 
        FROM metrics_data 
        WHERE host = ? 
        ORDER BY time DESC LIMIT ?
    """, (hostname, limit))
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in reversed(rows)]
    
    

@app.websocket('/ws/metrics/{hostname}')
async def websocket_data(ws: WebSocket, hostname: str):
    await ws.accept()
    conn = get_db_conn()
    cursor = conn.cursor()
    
    try:
        while True:
            cursor.execute("""
                SELECT cpu, memory, disk, load, time 
                FROM metrics_data 
                WHERE host = ? 
                ORDER BY time DESC LIMIT 1
            """, (hostname,))
            row = cursor.fetchone()
            if row:
                await ws.send_json(dict(row))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print(f"Client disconnected from host: {hostname}")
    finally:
        conn.close()

@app.get("/hosts")
async def list_hosts():
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT host, last_update FROM metrics")
    hosts = cursor.fetchall()
    conn.close()
    return [dict(h) for h in hosts]

    
    