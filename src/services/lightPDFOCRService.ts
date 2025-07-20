export interface OCRResult {
  cni: string;
  nom: string;
  prenom: string;
  success: boolean;
  error?: string;
}

export class LightPDFOCRService {
  /**
   * Extrait les informations d'une image de CNI
   */
  static async extractCNIInfo(imageFile: File): Promise<OCRResult> {
    try {
      // Simulation d'analyse OCR
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulation de détection de CNI (80% de chance de succès)
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        return {
          cni: '1234567890123456',
          nom: 'AKPA',
          prenom: 'SEBIM JEAN JACQUES',
          success: true
        };
      } else {
        return {
          cni: '',
          nom: '',
          prenom: '',
          success: false,
          error: 'CNI non détectée dans l\'image'
        };
      }
    } catch (error) {
      return {
        cni: '',
        nom: '',
        prenom: '',
        success: false,
        error: 'Erreur lors du traitement de l\'image'
      };
    }
  }

  /**
   * Valide si une image contient une CNI
   */
  static async validateCNIImage(imageFile: File): Promise<boolean> {
    try {
      // Simulation de validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation de validation (70% de chance de succès)
      return Math.random() > 0.3;
    } catch (error) {
      return false;
    }
  }
} 