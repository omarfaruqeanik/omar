#!/usr/bin/env python3
"""
Simple HTTP Server for Portfolio Website

Serves static files from the current directory.
Perfect for development and testing.
"""

import http.server
import socketserver
import os
from functools import partial

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(__file__), **kwargs)
    
    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == "__main__":
    handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"\n{'='*60}")
        print(f"Portfolio Server Running!")
        print(f"{'='*60}")
        print(f"\n📱 Portfolio Site:    http://localhost:{PORT}")
        print(f"🔐 Admin Login:       http://localhost:{PORT}/login.html")
        print(f"📊 Admin Dashboard:   http://localhost:{PORT}/dashboard.html")
        print(f"\nPress Ctrl+C to stop the server\n")
        print(f"{'='*60}\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped.")
            pass
