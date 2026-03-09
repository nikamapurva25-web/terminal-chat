import socket
import threading

HOST = "0.0.0.0"
PORT = 5000

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen()

clients = []
usernames = []

print("Server started. Waiting for connections...")

def broadcast(message):
    for client in clients:
        client.send(message)

def handle_client(client):

    while True:
        try:
            message = client.recv(1024)
            broadcast(message)
        except:
            index = clients.index(client)
            clients.remove(client)
            client.close()

            username = usernames[index]
            usernames.remove(username)

            broadcast(f"{username} left the chat\n".encode())
            break

def receive():

    while True:
        client, address = server.accept()

        print(f"Connected with {address}")

        client.send("USERNAME".encode())
        username = client.recv(1024).decode()

        usernames.append(username)
        clients.append(client)

        print(f"{username} joined")

        broadcast(f"{username} joined the chat!\n".encode())

        thread = threading.Thread(target=handle_client, args=(client,))
        thread.start()

receive()