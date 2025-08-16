import { ServerWebSocket } from "bun";
import { WSContext } from "hono/ws";

type EventPayload = {
  event: string;
  payload: any;
};

export class UserConnectionsHandler {
  private clientsMap: Map<number, Set<WSContext<ServerWebSocket<undefined>>>> =
    new Map();

  addConnection(userId: number, ws: WSContext<ServerWebSocket<undefined>>) {
    let connections = this.clientsMap.get(userId);
    if (!connections) {
      connections = new Set();
      this.clientsMap.set(userId, connections);
    }
    connections.add(ws);
  }

  removeConnection(userId: number, ws: WSContext<ServerWebSocket<undefined>>) {
    const connections = this.clientsMap.get(userId);
    if (!connections) return;

    connections.delete(ws);

    if (connections.size === 0) {
      this.clientsMap.delete(userId);
    }
  }

  broadcast(eventPayload: EventPayload) {
    const payload = JSON.stringify(eventPayload);

    this.clientsMap.forEach((connections) => {
      connections.forEach((ws) => ws.send(payload));
    });
  }

  broadcastExcept(
    excludedWs: WSContext<ServerWebSocket<undefined>>,
    eventPayload: EventPayload
  ) {
    const payload = JSON.stringify(eventPayload);

    this.clientsMap.forEach((connections) => {
      connections.forEach((ws) => {
        if (ws.raw !== excludedWs.raw) {
          ws.send(payload);
        }
      });
    });
  }

  notifyUser(userId: number, eventPayload: EventPayload) {
    const connections = this.clientsMap.get(userId);
    if (!connections) return;

    const payload = JSON.stringify(eventPayload);
    connections.forEach((ws) => ws.send(payload));
  }
}

export const userConnectionsManager = new UserConnectionsHandler();
