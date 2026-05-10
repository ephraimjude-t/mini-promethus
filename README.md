# Sentinel — Linux Observability & Monitoring Platform

Sentinel is a real-time Linux observability and monitoring platform built using FastAPI, React, WebSockets, SQLite, and Python.

The platform provides live system metrics, multi-host monitoring, Linux log ingestion, alerting, and real-time dashboard visualization through a modern interface designed for home labs, local infrastructure, and development environments.

---

## Features

- Real-time CPU, memory, disk, and load monitoring
- Multi-host monitoring support
- WebSocket-powered live updates
- Linux log ingestion using `journalctl`
- SQLite-backed persistence layer
- Real-time observability dashboard
- Alert system 
- Live metrics visualization with charts
- Terminal-style live logs panel
- Local-first lightweight architecture

---

## Tech Stack

### Backend
- FastAPI
- Python
- SQLite
- WebSockets

### Frontend
- React
- TailwindCSS
- Chart.js

### System / Infrastructure
- Linux
- `psutil`
- `journalctl`

---

## Architecture

```text
Linux Host
   ↓
Monitoring Agent
   ↓
SQLite Database
   ↓
FastAPI Backend
   ↓
WebSocket / REST API
   ↓
React Dashboard
