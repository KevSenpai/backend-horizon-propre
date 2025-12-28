import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// On autorise tout le monde (CORS) pour éviter les blocages Mobile/Web
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TrackingGateway');

  // Quand un appareil se connecte (Mobile ou Web)
  handleConnection(client: Socket) {
    this.logger.log(`Client connecté : ${client.id}`);
  }

  // Quand un appareil se déconnecte
  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté : ${client.id}`);
  }

  // --- 1. RECEPTION : Position GPS du Camion (Mobile -> Backend) ---
  @SubscribeMessage('sendPosition')
  handlePosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tourId: string; lat: number; lng: number }
  ) {
    // Log pour le debug (à retirer en prod si trop verbeux)
    this.logger.log(`📍 Position reçue pour la tournée ${payload.tourId}: [${payload.lat}, ${payload.lng}]`);

    // --- 2. EMISSION : Diffusion vers le Web (Backend -> Web) ---
    // On renvoie l'info sur un canal spécifique à cette tournée
    // Le Dashboard Web écoutera 'trackTour:ID_TOURNEE'
    this.server.emit(`trackTour:${payload.tourId}`, payload);
  }

  // --- 3. RECEPTION : Mise à jour Statut Collecte (Mobile -> Backend) ---
  @SubscribeMessage('updateCollectionStatus')
  handleCollectionStatus(
    @MessageBody() payload: { tourId: string; clientId: string; status: string }
  ) {
    this.logger.log(`✅ Collecte mise à jour : ${payload.clientId} -> ${payload.status}`);
    
    // On notifie le Dashboard pour qu'il mette à jour la barre de progression
    this.server.emit(`tourProgress:${payload.tourId}`, payload);
  }
}