// Configuration de l'API Gemini
const API_KEY = "AIzaSyChgcGY1ZGt0E53e8vhxk7_OratVWnOSF8";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface JobOffer {
  id: string;
  title: string;
  location: string;
  storeName?: string;
  country: string;
  workMode: string;
  requiredProfile: string;
  phone: string;
  whatsapp: string;
  isCertified: boolean;
  postedDate: string;
}

export interface SearchAnalysis {
  keywords: string[];
  jobTypes: string[];
  locations: string[];
  skills: string[];
  workMode: string[];
  confidence: number;
  originalLanguage: string;
  translatedQuery: string;
}

export class GeminiService {
  /**
   * Appelle l'API Gemini via REST
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erreur API Gemini:', error);
      throw error;
    }
  }

  /**
   * Méthode publique pour le chat - envoie un message à Gemini et retourne la réponse
   */
  async sendChatMessage(message: string): Promise<string> {
    try {
      const response = await this.callGeminiAPI(message);
      return response;
    } catch (error) {
      console.error('Erreur chat Gemini:', error);
      throw error;
    }
  }

  /**
   * Analyse une requête de recherche avec Gemini et extrait les informations pertinentes
   */
  async analyzeSearchQuery(userQuery: string, availableJobs: JobOffer[]): Promise<SearchAnalysis> {
    try {
      // Créer un contexte avec les emplois disponibles
      const jobContext = this.createJobContext(availableJobs);
      
      const prompt = `
Tu es un assistant spécialisé dans l'analyse de requêtes de recherche d'emploi.

CONTEXTE DES EMPLOIS DISPONIBLES:
${jobContext}

REQUÊTE DE L'UTILISATEUR:
"${userQuery}"

TÂCHE:
Analyse cette requête et extrait les informations pertinentes pour la recherche d'emploi.

RÉPONSE ATTENDUE (format JSON):
{
  "keywords": ["mots-clés", "extraits", "de", "la", "requête"],
  "jobTypes": ["types", "d'emplois", "recherchés"],
  "locations": ["lieux", "géographiques", "mentionnés"],
  "skills": ["compétences", "ou", "profil", "recherché"],
  "workMode": ["mode", "de", "travail", "préféré"],
  "confidence": 0.85
}

IMPORTANT:
- Retourne UNIQUEMENT le JSON, sans texte supplémentaire
- Les arrays peuvent être vides si aucune information n'est trouvée
- Confidence doit être entre 0 et 1
- Utilise les termes exacts des emplois disponibles quand possible
`;

      const responseText = await this.callGeminiAPI(prompt);
      
      // Nettoyer la réponse pour extraire le JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Réponse invalide de Gemini');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Ajouter les propriétés manquantes
      const completeAnalysis: SearchAnalysis = {
        ...analysis,
        originalLanguage: 'fr',
        translatedQuery: userQuery
      };
      
      console.log('Analyse Gemini:', completeAnalysis);
      return completeAnalysis;
      
    } catch (error) {
      console.error('Erreur Gemini:', error);
      
      // Fallback vers l'analyse simple
      return this.fallbackAnalysis(userQuery);
    }
  }

  /**
   * Crée un contexte des emplois disponibles pour Gemini
   */
  private createJobContext(jobs: JobOffer[]): string {
    return jobs.map(job => 
      `- ${job.title} (${job.location}, ${job.country}): ${job.requiredProfile} - ${job.workMode}`
    ).join('\n');
  }

  /**
   * Extrait les mots-clés simples d'une requête (pour l'affichage)
   */
  extractKeywords(query: string): string[] {
    const stopWords = [
      'je', 'cherche', 'un', 'une', 'des', 'le', 'la', 'les', 'du', 'de', 'travail', 'emploi', 'poste', 'job',
      'veux', 'voulez', 'souhaite', 'aimerais', 'recherche', 'trouver', 'pour', 'avec', 'dans', 'sur', 'à', 'au',
      'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'leurs'
    ];
    
    return query.toLowerCase()
      .replace(/[.,!?;:]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  /**
   * Analyse de fallback si Gemini échoue
   */
  private fallbackAnalysis(query: string): SearchAnalysis {
    const keywords = query.toLowerCase()
      .replace(/[.,!?;:]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    return {
      keywords,
      jobTypes: [],
      locations: [],
      skills: [],
      workMode: [],
      confidence: 0.5,
      originalLanguage: 'fr',
      translatedQuery: query
    };
  }

  /**
   * Filtre les emplois basé sur l'analyse Gemini
   */
  filterJobsByAnalysis(jobs: JobOffer[], analysis: SearchAnalysis): JobOffer[] {
    return jobs.filter(job => {
      const jobText = [
        job.title,
        job.location,
        job.storeName || '',
        job.requiredProfile,
        job.workMode,
        job.country
      ].join(' ').toLowerCase();

      // Vérifier les mots-clés
      const hasKeywordMatch = analysis.keywords.some(keyword =>
        jobText.includes(keyword.toLowerCase())
      );

      // Vérifier les types d'emplois
      const hasJobTypeMatch = analysis.jobTypes.length === 0 || 
        analysis.jobTypes.some(type =>
          job.title.toLowerCase().includes(type.toLowerCase())
        );

      // Vérifier les localisations
      const hasLocationMatch = analysis.locations.length === 0 ||
        analysis.locations.some(location =>
          job.location.toLowerCase().includes(location.toLowerCase()) ||
          job.country.toLowerCase().includes(location.toLowerCase())
        );

      // Vérifier les compétences
      const hasSkillMatch = analysis.skills.length === 0 ||
        analysis.skills.some(skill =>
          job.requiredProfile.toLowerCase().includes(skill.toLowerCase())
        );

      // Vérifier le mode de travail
      const hasWorkModeMatch = analysis.workMode.length === 0 ||
        analysis.workMode.some(mode =>
          job.workMode.toLowerCase().includes(mode.toLowerCase())
        );

      return hasKeywordMatch || hasJobTypeMatch || hasLocationMatch || hasSkillMatch || hasWorkModeMatch;
    });
  }
}

export const geminiSearchService = new GeminiService();

