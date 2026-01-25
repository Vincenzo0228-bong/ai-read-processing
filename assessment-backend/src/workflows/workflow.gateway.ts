import Redis from 'ioredis';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/workflow',
})
@Injectable()
export class WorkflowGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private redisSub: Redis;
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WorkflowGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    // Subscribe to Redis Pub/Sub for workflow status updates
    this.redisSub = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
    this.redisSub.subscribe('workflow-status', (err, count) => {
      if (err) {
        this.logger.error('Failed to subscribe to workflow-status channel', err);
      } else {
        this.logger.log('Subscribed to workflow-status channel');
      }
    });
    this.redisSub.on('message', (channel, message) => {
      this.logger.log(`[Redis] Message received on channel ${channel}: ${message}`);
      if (channel === 'workflow-status') {
        try {
          const { userId, leadId, status } = JSON.parse(message);
          this.logger.log(`[Gateway] Emitting workflowStatus: userId=${userId}, leadId=${leadId}, status=${status}`);
          this.emitWorkflowStatusUpdate(userId, leadId, status);
        } catch (err) {
          this.logger.error('Failed to parse workflow-status message', err);
        }
      }
    });
  }

  handleConnection(client: any) {
    this.logger.log(`[Socket] Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`[Socket] Client disconnected: ${client.id}`);
  }

  emitWorkflowStatusUpdate(userId: string, leadId: string, status: string) {
    // Emit to all clients for now; can be filtered by userId if needed
    if (!this.server) {
      this.logger.error('WebSocket server is not initialized');
      return;
    }
    this.logger.log(`[Socket] Emitting workflowStatus to clients: userId=${userId}, leadId=${leadId}, status=${status}`);
    this.server.emit('workflowStatus', { userId, leadId, status });
  }
}
