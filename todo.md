- Send a 'connect' command to server on client's behalf to connect to peer network (click connect button)

# Command List
* 'connect : client -> server
* 'send-offer' : server -> client
* 'accept-offer' : server -> client
* 'send-candidate' : client -> server

# Connect Process
- If there are connected clients, send the 'send-offer' command to the connecting client and randomly
select a connected client to send the offer to / wait to receive an answer from
- If there are any pending offers, select one at random and send client asking to connect the 'accept-offer' command
with the randomly selected pending offer
- If there are no connected clients, send the 'send-offer' command to the connecting client
- Maintain a queue of pending offers, these will need to be flushed when 2 peers are connected.  This initial connection
will be the seed of the network

# Notes:
- Nodes are weakly linked, meaning they are only connected to one other node in the network
- It's always preferred to connect to a node already in the peer network
- Whenever a node disconnects, all of it's connected nodes must re-go through the connect process