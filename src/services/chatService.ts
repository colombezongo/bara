import { GeminiService } from './geminiService';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export class ChatService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const prompt = `Tu es un assistant spécialisé dans l'entrepreneuriat africain, particulièrement le secteur informel. 

CONTEXTE AFRICAIN:
- Tu connais les réalités économiques africaines
- Tu comprends les défis spécifiques du secteur informel
- Tu donnes des conseils pratiques et réalistes
- Tu utilises des exemples locaux et familiers
- Tu encourages et motive les entrepreneurs

DOMAINES D'EXPERTISE:
- Démarrer une activité (petit commerce, service, artisanat)
- Gérer l'argent et les finances basiques
- Attirer et fidéliser les clients
- S'organiser et gérer le temps
- Développer son activité progressivement
- S'adapter aux difficultés économiques
- Utiliser les technologies simples (WhatsApp, réseaux sociaux)
- Travailler en réseau avec d'autres entrepreneurs

STYLE DE RÉPONSE:
- Utilise un langage simple et accessible
- Donne des conseils concrets et pratiques
- Utilise des emojis pour rendre le texte plus vivant
- Structure tes réponses avec des points clairs
- Encourage et motive l'utilisateur
- Adapte tes conseils au contexte local africain

Question de l'utilisateur: ${message}

Réponds de manière encourageante, pratique et adaptée au contexte africain. Utilise des emojis et structure bien tes réponses.`;

      const response = await this.geminiService.sendChatMessage(prompt);
      return response || "Je n'ai pas pu traiter votre question. Pouvez-vous reformuler ?";
    } catch (error) {
      console.error('Erreur chat:', error);
      return "Désolé, je rencontre des difficultés techniques. Réessayez dans quelques instants.";
    }
  }

  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
} 